import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, describe, it } from "node:test";
import { NextRequest } from "next/server";
import { GET as callbackGet } from "../app/qbo/callback/route";
import { GET as connectGet } from "../app/qbo/connect/route";
import { POST as issueKeyPost } from "../app/api/qbo-client-key/route";
import { GET as healthGet } from "../app/api/cron/qbo-health/route";
import { GET as refreshCronGet } from "../app/api/cron/qbo-refresh/route";
import { GET as tokenGet } from "../app/api/qbo-token/route";
import { hashClientApiKey, issueClientApiKey, presentedKeyMatches } from "../lib/qbo-client-keys";
import { listQboClientSlugs } from "../lib/qbo-clients";
import { escapeHtml, renderConnectionPage } from "../lib/qbo-html";
import { qboClientKey, qboLockKey } from "../lib/qbo-keys";
import { readOAuthState, resolveStateSigningKey, signOAuthState } from "../lib/qbo-oauth-state";
import { QboStorageError, QboTokenRecord } from "../lib/qbo-records";
import { setQboTestHooks } from "../lib/qbo-runtime";
import {
  callbackClientSlug,
  cronAuthorized,
  isValidClientSlug,
  oauthDenialMessage,
  publicRefreshError,
  realmReconnectDecision,
  safeEqual,
  sanitizeIntuitFailure,
  sharedSecretAllowed,
} from "../lib/qbo-security";
import { getQboTokens, getValidAccessToken, saveQboTokens } from "../lib/qbo-token-helper";
import { createMemoryKv } from "./memory-kv";

const ENV_KEYS = [
  "QBO_OAUTH_STATE_SECRET",
  "QBO_CLIENT_ID",
  "QBO_CLIENT_SECRET",
  "QBO_REDIRECT_URI",
  "QBO_TOKEN_API_SECRET",
  "QBO_ALLOW_SHARED_SECRET",
  "QBO_KEY_ADMIN_SECRET",
  "CRON_SECRET",
  "KV_REST_API_TOKEN",
  "KV_REST_API_URL",
] as const;

const envSnapshot = new Map<string, string | undefined>();

function rememberEnv(): void {
  envSnapshot.clear();
  for (const key of ENV_KEYS) envSnapshot.set(key, process.env[key]);
}

function restoreEnv(): void {
  for (const [key, value] of envSnapshot) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  setQboTestHooks(null);
}

rememberEnv();
afterEach(restoreEnv);

function useTestEnv(): void {
  process.env.QBO_OAUTH_STATE_SECRET = "test-state-secret";
  process.env.QBO_CLIENT_ID = "client-id";
  process.env.QBO_CLIENT_SECRET = "client-secret";
  process.env.QBO_REDIRECT_URI = "https://www.clarixhq.ai/qbo/callback";
  process.env.QBO_TOKEN_API_SECRET = "shared-secret-value";
  delete process.env.QBO_ALLOW_SHARED_SECRET;
  delete process.env.QBO_KEY_ADMIN_SECRET;
  process.env.CRON_SECRET = "cron-secret-value";
}

function tokenRecord(overrides: Partial<QboTokenRecord> = {}): QboTokenRecord {
  const now = Date.now();
  return {
    access_token: "access-token-value",
    refresh_token: "refresh-token-value",
    realmId: "123456789",
    company_name: "Mills Wealth",
    expires_at: now + 60 * 60 * 1000,
    refresh_token_expires_at: now + 100 * 24 * 60 * 60 * 1000,
    connected_at: "2026-08-21T17:40:00.000Z",
    updated_at: "2026-08-21T17:40:00.000Z",
    needs_reauth: false,
    ...overrides,
  };
}

function intuitMock(companyName = "Mills </p><script>alert(1)</script>"): typeof fetch {
  return async (input) => {
    const url = String(input);
    if (url.includes("oauth.platform.intuit.com")) {
      return Response.json({
        access_token: "access-from-intuit",
        refresh_token: "refresh-from-intuit",
        expires_in: 3600,
        x_refresh_token_expires_in: 8_726_400,
      });
    }
    if (url.includes("/companyinfo/")) {
      return Response.json({ CompanyInfo: { CompanyName: companyName } });
    }
    return new Response("unexpected", { status: 500 });
  };
}

async function readJson(response: Response): Promise<Record<string, unknown>> {
  return (await response.json()) as Record<string, unknown>;
}

describe("html and oauth state", () => {
  it("escapes every character that can break out of HTML", () => {
    const payload = `</p><script>alert(1)</script><img src=x onerror=alert(1)> " ' &`;
    const html = renderConnectionPage({ success: false, message: payload });
    assert.equal(html.includes("<script>"), false);
    assert.equal(html.includes("<img"), false);
    assert.match(html, /&lt;script&gt;/);
    assert.equal(escapeHtml(`"`), "&quot;");
    assert.equal(escapeHtml(`'`), "&#39;");
  });

  it("does not echo an unexpected OAuth error into the message", () => {
    assert.equal(oauthDenialMessage(`<script>alert(1)</script>`).includes("script"), false);
    assert.match(oauthDenialMessage("access_denied"), /access_denied/);
  });

  it("ignores realmId when state is missing", () => {
    assert.equal(callbackClientSlug(null, "999888777"), null);
    assert.equal(callbackClientSlug("mikemills-buck", "999888777"), "mikemills-buck");
  });

  it("refuses to rebind a slug onto a different company", () => {
    assert.equal(realmReconnectDecision(null, "111"), "allow_new");
    assert.equal(realmReconnectDecision(undefined, "111"), "allow_new");
    assert.equal(realmReconnectDecision("111", "111"), "allow_same");
    assert.equal(realmReconnectDecision("111", "222"), "refuse_rebind");
  });

  it("rejects a tampered or expired state and accepts a signed one", () => {
    const secret = "signing-key";
    const state = signOAuthState({ slug: "chp-primary", nonce: "a".repeat(24), exp: 5_000 }, secret);
    assert.deepEqual(readOAuthState(state, secret, 4_000), {
      slug: "chp-primary",
      nonce: "a".repeat(24),
      exp: 5_000,
    });
    assert.equal(readOAuthState(state, secret, 5_000), null);
    assert.equal(readOAuthState(state, "other-key", 4_000), null);
    const tampered = `x${state.slice(1)}`;
    assert.equal(readOAuthState(tampered, secret, 4_000), null);
  });

  it("derives the state key from the KV token instead of using that token raw", () => {
    const derived = resolveStateSigningKey({ KV_REST_API_TOKEN: "kv-token-value" });
    assert.notEqual(derived, "kv-token-value");
    assert.equal(resolveStateSigningKey({ QBO_OAUTH_STATE_SECRET: "dedicated", KV_REST_API_TOKEN: "kv" }), "dedicated");
    assert.throws(() => resolveStateSigningKey({}));
  });
});

describe("auth helpers", () => {
  it("compares secrets without accepting a prefix", () => {
    assert.equal(safeEqual("shared-secret-value", "shared-secret-value"), true);
    assert.equal(safeEqual("shared-secret-value", "shared-secret-valu"), false);
    assert.equal(safeEqual("", "x"), false);
  });

  it("keeps the shared secret enabled unless the flag is explicitly off", () => {
    assert.equal(sharedSecretAllowed(undefined), true);
    assert.equal(sharedSecretAllowed(""), true);
    assert.equal(sharedSecretAllowed("true"), true);
    assert.equal(sharedSecretAllowed("false"), false);
    assert.equal(sharedSecretAllowed("0"), false);
    assert.equal(sharedSecretAllowed("off"), false);
  });

  it("rejects cron calls unless the bearer token matches a configured secret", () => {
    assert.equal(cronAuthorized("Bearer cron-secret-value", undefined), false);
    assert.equal(cronAuthorized("Bearer cron-secret-value", ""), false);
    assert.equal(cronAuthorized(null, "cron-secret-value"), false);
    assert.equal(cronAuthorized("Bearer wrong", "cron-secret-value"), false);
    assert.equal(cronAuthorized("Bearer cron-secret-value", "cron-secret-value"), true);
  });

  it("strips Intuit bodies from stored refresh errors", () => {
    const raw = `HTTP 400: {"error":"invalid_grant","error_description":"SECRETVALUE leaked"}`;
    assert.equal(sanitizeIntuitFailure(400, raw).safeCode, "invalid_grant");
    assert.equal(sanitizeIntuitFailure(400, raw).invalidGrant, true);
    assert.equal(publicRefreshError(raw), "invalid_grant");
    assert.equal(publicRefreshError("token body SECRETVALUE"), "refresh_error");
    assert.equal(sanitizeIntuitFailure(503, "SECRETVALUE").safeCode, "http_503");
  });

  it("accepts the live client slugs and rejects path-like values", () => {
    for (const slug of ["mikemills-buck", "chp-primary", "tcre-capital-buck", "amtm-investments-buck"]) {
      assert.equal(isValidClientSlug(slug), true);
    }
    assert.equal(isValidClientSlug("Chp-Primary"), false);
    assert.equal(isValidClientSlug("../etc"), false);
    assert.equal(isValidClientSlug("a"), true);
    assert.equal(isValidClientSlug("-a"), false);
  });
});

describe("callback and connect", () => {
  it("escapes the error query and does not fall back to realmId", async () => {
    useTestEnv();
    const xss = await callbackGet(
      new NextRequest("https://www.clarixhq.ai/qbo/callback?error=%3Cscript%3Ealert(1)%3C/script%3E"),
    );
    const xssHtml = await xss.text();
    assert.equal(xss.status, 400);
    assert.equal(xssHtml.includes("<script>"), false);
    assert.equal(xssHtml.includes("alert(1)"), false);

    const known = await callbackGet(new NextRequest("https://www.clarixhq.ai/qbo/callback?error=access_denied"));
    assert.match(await known.text(), /access_denied/);

    const missingState = await callbackGet(
      new NextRequest("https://www.clarixhq.ai/qbo/callback?code=auth-code-1&realmId=999888777"),
    );
    const missingHtml = await missingState.text();
    assert.equal(missingState.status, 400);
    assert.equal(missingHtml.includes("999888777"), false);
    assert.equal(missingHtml.includes("connected successfully"), false);
  });

  it("connects a new company, rejects replay and a different realm, and allows the same company", async () => {
    useTestEnv();
    const kv = createMemoryKv();
    setQboTestHooks({ kv, fetch: intuitMock() });

    const started = await connectGet(new NextRequest("https://www.clarixhq.ai/qbo/connect?client=mikemills-buck"));
    assert.equal(started.status, 302);
    const location = started.headers.get("location") || "";
    assert.match(location, /^https:\/\/appcenter\.intuit\.com\/connect\/oauth2\?/);
    const state = new URL(location).searchParams.get("state");
    assert.ok(state);

    const callbackUrl = `https://www.clarixhq.ai/qbo/callback?code=auth-code-1&realmId=123456789&state=${encodeURIComponent(state)}`;
    const connected = await callbackGet(new NextRequest(callbackUrl));
    const connectedHtml = await connected.text();
    assert.equal(connected.status, 200);
    assert.match(connectedHtml, /Connected/);
    assert.match(connectedHtml, /mikemills-buck/);
    assert.equal(connectedHtml.includes("<script>"), false);
    assert.match(connectedHtml, /&lt;script&gt;/);

    const stored = await getQboTokens("mikemills-buck");
    assert.equal(stored?.realmId, "123456789");
    assert.equal(stored?.access_token, "access-from-intuit");
    assert.equal(stored?.company_name?.includes("<script>"), true);

    const replay = await callbackGet(new NextRequest(callbackUrl));
    assert.equal(replay.status, 400);
    assert.equal((await getQboTokens("mikemills-buck"))?.access_token, "access-from-intuit");

    const again = await connectGet(new NextRequest("https://www.clarixhq.ai/qbo/connect?client=mikemills-buck"));
    const againState = new URL(again.headers.get("location") || "").searchParams.get("state");
    const rebound = await callbackGet(
      new NextRequest(
        `https://www.clarixhq.ai/qbo/callback?code=auth-code-2&realmId=999888777&state=${encodeURIComponent(againState || "")}`,
      ),
    );
    const reboundHtml = await rebound.text();
    assert.equal(rebound.status, 409);
    assert.equal(reboundHtml.includes("999888777"), false);
    assert.equal(reboundHtml.includes("chp-primary"), false);
    assert.equal((await getQboTokens("mikemills-buck"))?.realmId, "123456789");

    const third = await connectGet(new NextRequest("https://www.clarixhq.ai/qbo/connect?client=mikemills-buck"));
    const thirdState = new URL(third.headers.get("location") || "").searchParams.get("state");
    setQboTestHooks({
      kv,
      fetch: async (input) => {
        const url = String(input);
        if (url.includes("oauth.platform.intuit.com")) {
          return Response.json({
            access_token: "access-reconnect",
            refresh_token: "refresh-reconnect",
            expires_in: 3600,
            x_refresh_token_expires_in: 8_726_400,
          });
        }
        return Response.json({ CompanyInfo: { CompanyName: "Mills Wealth" } });
      },
    });
    const same = await callbackGet(
      new NextRequest(
        `https://www.clarixhq.ai/qbo/callback?code=auth-code-3&realmId=123456789&state=${encodeURIComponent(thirdState || "")}`,
      ),
    );
    assert.equal(same.status, 200);
    const reconnected = await getQboTokens("mikemills-buck");
    assert.equal(reconnected?.access_token, "access-reconnect");
    assert.equal(reconnected?.connected_at, stored?.connected_at);
    assert.equal(reconnected?.realmId, "123456789");
  });

  it("does not name the other client when the company is already connected", async () => {
    useTestEnv();
    const kv = createMemoryKv();
    setQboTestHooks({ kv, fetch: intuitMock("Acme") });
    await saveQboTokens("chp-primary", tokenRecord({ realmId: "123456789" }));

    const started = await connectGet(new NextRequest("https://www.clarixhq.ai/qbo/connect?client=mikemills-buck"));
    const state = new URL(started.headers.get("location") || "").searchParams.get("state");
    const response = await callbackGet(
      new NextRequest(
        `https://www.clarixhq.ai/qbo/callback?code=auth-code-9&realmId=123456789&state=${encodeURIComponent(state || "")}`,
      ),
    );
    const html = await response.text();
    assert.equal(response.status, 409);
    assert.equal(html.includes("chp-primary"), false);
    assert.equal(html.includes("123456789"), false);
    assert.equal(await getQboTokens("mikemills-buck"), null);
  });
});

describe("token refresh", () => {
  it("does not serve an expired access token when Intuit fails", async () => {
    useTestEnv();
    const kv = createMemoryKv();
    setQboTestHooks({ kv });
    const expired = tokenRecord({
      access_token: "expired-access-SECRET",
      expires_at: Date.now() - 60_000,
    });
    await saveQboTokens("mikemills-buck", expired);
    setQboTestHooks({
      kv,
      fetch: async () =>
        Response.json({ error: "invalid_grant", error_description: "SECRETVALUE from Intuit" }, { status: 400 }),
    });

    const result = await getValidAccessToken("mikemills-buck");
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.reason, "refresh_failed");
      assert.equal(result.detail, "reauth_required");
    }
    const stored = await getQboTokens("mikemills-buck");
    assert.equal(stored?.needs_reauth, true);
    assert.equal(stored?.last_refresh_error, "invalid_grant");
    assert.equal(JSON.stringify(stored).includes("SECRETVALUE"), false);
  });

  it("returns a retryable error instead of an expired token when the lock is held", async () => {
    useTestEnv();
    const kv = createMemoryKv();
    setQboTestHooks({ kv, timing: { lockWaitMs: 5, lockMaxWaitMs: 15 } });
    await saveQboTokens("mikemills-buck", tokenRecord({ access_token: "expired-access", expires_at: Date.now() - 1000 }));
    assert.equal(await kv.acquireLock(qboLockKey("mikemills-buck"), "other-owner", 30), true);

    const result = await getValidAccessToken("mikemills-buck");
    assert.deepEqual(result, { ok: false, reason: "refresh_in_progress", detail: "retry" });
    assert.equal(await kv.releaseLock(qboLockKey("mikemills-buck"), "intruder"), false);
    assert.equal(await kv.acquireLock(qboLockKey("mikemills-buck"), "third", 30), false);
    assert.equal((await getQboTokens("mikemills-buck"))?.access_token, "expired-access");
  });

  it("does not let an older refresh overwrite a newer token", async () => {
    useTestEnv();
    const kv = createMemoryKv();
    setQboTestHooks({ kv });
    await saveQboTokens(
      "mikemills-buck",
      tokenRecord({ access_token: "old-access", expires_at: Date.now() - 1000 }),
    );
    setQboTestHooks({
      kv,
      fetch: async () => {
        await saveQboTokens(
          "mikemills-buck",
          tokenRecord({ access_token: "callback-access", refresh_token: "callback-refresh" }),
        );
        return Response.json({
          access_token: "stale-refresh-access",
          refresh_token: "stale-refresh-token",
          expires_in: 3600,
          x_refresh_token_expires_in: 8_726_400,
        });
      },
    });

    const result = await getValidAccessToken("mikemills-buck");
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.accessToken, "callback-access");
    const stored = await getQboTokens("mikemills-buck");
    assert.equal(stored?.access_token, "callback-access");
    assert.equal(stored?.refresh_token, "callback-refresh");
  });

  it("aborts a hung Intuit call and does not return the expired token", async () => {
    useTestEnv();
    const kv = createMemoryKv();
    setQboTestHooks({ kv });
    await saveQboTokens("chp-primary", tokenRecord({ access_token: "expired-access", expires_at: Date.now() - 1000 }));
    let sawSignal = false;
    setQboTestHooks({
      kv,
      timing: { intuitTimeoutMs: 30 },
      fetch: (_input, init) =>
        new Promise((_resolve, reject) => {
          const signal = init?.signal;
          sawSignal = Boolean(signal);
          if (!signal) {
            reject(new Error("missing timeout"));
            return;
          }
          // AbortSignal.timeout() does not keep the event loop alive by itself.
          const keepAlive = setTimeout(() => {
            reject(new Error("Intuit call was not aborted"));
          }, 1000);
          signal.addEventListener("abort", () => {
            clearTimeout(keepAlive);
            reject(signal.reason instanceof Error ? signal.reason : new Error("aborted"));
          });
        }),
    });

    const result = await getValidAccessToken("chp-primary");
    assert.equal(sawSignal, true);
    assert.deepEqual(result, { ok: false, reason: "refresh_in_progress", detail: "retry" });
  });

  it("serves a still-valid token and reports storage errors instead of no_connection", async () => {
    useTestEnv();
    const kv = createMemoryKv();
    setQboTestHooks({ kv });
    await saveQboTokens("mikemills-buck", tokenRecord());
    let called = false;
    setQboTestHooks({
      kv,
      fetch: async () => {
        called = true;
        return new Response("nope", { status: 500 });
      },
    });
    const fresh = await getValidAccessToken("mikemills-buck");
    assert.equal(fresh.ok, true);
    assert.equal(called, false);

    setQboTestHooks({
      kv: {
        ...kv,
        async get() {
          throw new QboStorageError("down");
        },
      },
    });
    const down = await getValidAccessToken("mikemills-buck");
    assert.deepEqual(down, { ok: false, reason: "storage_error" });
  });
});

describe("token API and per-client keys", () => {
  it("keeps the shared-secret contract and scopes a client key to one slug", async () => {
    useTestEnv();
    const kv = createMemoryKv();
    setQboTestHooks({ kv });
    await saveQboTokens("mikemills-buck", tokenRecord({ access_token: "mills-access", realmId: "111" }));
    await saveQboTokens("chp-primary", tokenRecord({ access_token: "chp-access", realmId: "222" }));
    setQboTestHooks({ kv });

    const legacy = await tokenGet(
      new NextRequest("https://www.clarixhq.ai/api/qbo-token?client=mikemills-buck&secret=shared-secret-value"),
    );
    assert.equal(legacy.status, 200);
    assert.deepEqual(await readJson(legacy), { accessToken: "mills-access", realmId: "111" });
    assert.equal(legacy.headers.get("cache-control"), "no-store");

    const missing = await tokenGet(
      new NextRequest("https://www.clarixhq.ai/api/qbo-token?client=missing-client&secret=shared-secret-value"),
    );
    assert.deepEqual(await readJson(missing), {
      error: true,
      reason: `no_connection: client "missing-client" has not connected QBO yet`,
    });

    const issued = await issueClientApiKey("mikemills-buck", { rotate: false });
    assert.equal(issued.ok, true);
    if (!issued.ok) return;
    const raw = await kv.get("qbo:apikey:mikemills-buck");
    assert.equal(String(raw).includes(issued.apiKey), false);
    assert.match(String(raw), new RegExp(hashClientApiKey(issued.apiKey)));

    const scoped = await tokenGet(
      new NextRequest("https://www.clarixhq.ai/api/qbo-token?client=mikemills-buck", {
        headers: { "X-QBO-Client-Key": issued.apiKey },
      }),
    );
    assert.deepEqual(await readJson(scoped), { accessToken: "mills-access", realmId: "111" });

    const crossed = await tokenGet(
      new NextRequest("https://www.clarixhq.ai/api/qbo-token?client=chp-primary&secret=shared-secret-value", {
        headers: { "X-QBO-Client-Key": issued.apiKey },
      }),
    );
    assert.equal(crossed.status, 401);

    const duplicate = await issueClientApiKey("mikemills-buck", { rotate: false });
    assert.deepEqual(duplicate, { ok: false, reason: "key_exists" });

    const rotated = await issueClientApiKey("mikemills-buck", { rotate: true, now: 1_000 });
    assert.equal(rotated.ok, true);
    if (!rotated.ok) return;
    setQboTestHooks({ kv, now: () => 1_000 + 24 * 60 * 60 * 1000 });
    const oldStillWorks = await tokenGet(
      new NextRequest("https://www.clarixhq.ai/api/qbo-token?client=mikemills-buck", {
        headers: { "X-QBO-Client-Key": issued.apiKey },
      }),
    );
    assert.equal(oldStillWorks.status, 200);
    setQboTestHooks({ kv, now: () => 1_000 + 8 * 24 * 60 * 60 * 1000 });
    const oldExpired = await tokenGet(
      new NextRequest("https://www.clarixhq.ai/api/qbo-token?client=mikemills-buck", {
        headers: { "X-QBO-Client-Key": issued.apiKey },
      }),
    );
    assert.equal(oldExpired.status, 401);
    const newKeyWorks = await tokenGet(
      new NextRequest("https://www.clarixhq.ai/api/qbo-token?client=mikemills-buck", {
        headers: { "X-QBO-Client-Key": rotated.apiKey },
      }),
    );
    assert.equal(newKeyWorks.status, 200);

    process.env.QBO_ALLOW_SHARED_SECRET = "false";
    const legacyOff = await tokenGet(
      new NextRequest("https://www.clarixhq.ai/api/qbo-token?client=chp-primary&secret=shared-secret-value"),
    );
    assert.equal(legacyOff.status, 401);
  });

  it("hides the key admin route until its secret is set", async () => {
    useTestEnv();
    setQboTestHooks({ kv: createMemoryKv() });
    const hidden = await issueKeyPost(
      new NextRequest("https://www.clarixhq.ai/api/qbo-client-key", {
        method: "POST",
        body: JSON.stringify({ slug: "mikemills-buck" }),
      }),
    );
    assert.equal(hidden.status, 404);

    process.env.QBO_KEY_ADMIN_SECRET = "admin-secret";
    const issued = await issueKeyPost(
      new NextRequest("https://www.clarixhq.ai/api/qbo-client-key", {
        method: "POST",
        headers: { Authorization: "Bearer admin-secret", "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "chp-primary" }),
      }),
    );
    const body = await readJson(issued);
    assert.equal(issued.status, 200);
    assert.equal(typeof body.apiKey, "string");
    assert.equal(String(body.apiKey).startsWith("cxk_"), true);
    assert.equal(presentedKeyMatches(null, "nope", 0), false);
  });
});

describe("crons and client registry", () => {
  it("uses a once-a-day schedule and discovers clients from KV", async () => {
    const vercel = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8")) as {
      crons: { path: string; schedule: string }[];
    };
    assert.deepEqual(vercel.crons, [
      { path: "/api/cron/qbo-refresh", schedule: "0 10 * * *" },
      { path: "/api/cron/qbo-health", schedule: "0 15 * * *" },
    ]);
    const setup = readFileSync(new URL("../SETUP.md", import.meta.url), "utf8");
    assert.match(setup, /CRON_SECRET/);
    assert.match(setup, /christian@clarixhq.ai/);
    assert.match(setup, /QBO_ALLOW_SHARED_SECRET/);
    assert.match(setup, /X-QBO-Client-Key/);

    useTestEnv();
    const kv = createMemoryKv();
    await kv.set(qboClientKey("chp-primary"), JSON.stringify(tokenRecord({ access_token: "chp-secret-access" })));
    setQboTestHooks({ kv });
    assert.deepEqual(await listQboClientSlugs(), ["chp-primary"]);

    const denied = await refreshCronGet(new NextRequest("https://www.clarixhq.ai/api/cron/qbo-refresh"));
    assert.equal(denied.status, 401);

    delete process.env.CRON_SECRET;
    const unconfigured = await refreshCronGet(
      new NextRequest("https://www.clarixhq.ai/api/cron/qbo-refresh", {
        headers: { Authorization: "Bearer cron-secret-value" },
      }),
    );
    assert.equal(unconfigured.status, 401);
    process.env.CRON_SECRET = "cron-secret-value";

    const refreshed = await refreshCronGet(
      new NextRequest("https://www.clarixhq.ai/api/cron/qbo-refresh", {
        headers: { Authorization: "Bearer cron-secret-value" },
      }),
    );
    const body = await readJson(refreshed);
    assert.equal(refreshed.status, 200);
    assert.equal(JSON.stringify(body).includes("chp-secret-access"), false);
    assert.equal((body.results as { "chp-primary": { status: string } })["chp-primary"].status, "still_fresh");

    const health = await healthGet(
      new NextRequest("https://www.clarixhq.ai/api/cron/qbo-health", {
        headers: { Authorization: "Bearer cron-secret-value" },
      }),
    );
    const healthBody = await readJson(health);
    assert.equal(health.status, 200);
    assert.deepEqual(healthBody.checked_slugs, ["chp-primary"]);
    assert.equal(JSON.stringify(healthBody).includes("chp-secret-access"), false);
  });
});

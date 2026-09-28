import assert from "node:assert/strict";
import { createHash, randomBytes } from "node:crypto";
import { afterEach, describe, it } from "node:test";
import { NextRequest } from "next/server";
import { POST as intakePost } from "../app/api/intake/route";
import { GET as tokenGet } from "../app/api/qbo-token/route";
import { GET as tokenDebugGet } from "../app/api/qbo-token-debug/route";
import { buildIntakeMessage } from "../lib/intake-mail";
import { sanitizeSecurityEvent } from "../lib/qbo-audit";
import { QBO_AUDIT_KEY, qboClientKey } from "../lib/qbo-keys";
import {
  decodeTokenFromStorage,
  encodeTokenForStorage,
  resetTokenCryptoWarningsForTests,
  tokenStorageLabel,
} from "../lib/qbo-crypto";
import { contentSecurityPolicy, securityHeaders } from "../lib/security-headers";
import {
  clearRateLimitTestOverrides,
  clientIp,
  consumeRateLimit,
  RATE_LIMITS,
  setRateLimitTestOverride,
} from "../lib/qbo-rate-limit";
import { QboCorruptRecordError, QboTokenRecord } from "../lib/qbo-records";
import { setQboTestHooks } from "../lib/qbo-runtime";
import { issueClientApiKey } from "../lib/qbo-client-keys";
import { getQboTokens, saveQboTokens, upgradePlaintextToken } from "../lib/qbo-token-helper";
import { createMemoryKv } from "./memory-kv";

const ENV = ["QBO_TOKEN_ENC_KEY", "QBO_TOKEN_ENC_KEY_VERSION", "QBO_TOKEN_ENC_KEYS", "QBO_TOKEN_API_SECRET", "QBO_ALLOW_SHARED_SECRET"] as const;
const snapshot = new Map<string, string | undefined>();

function tokenRecord(access = "access-token-value"): QboTokenRecord {
  const now = Date.now();
  return {
    access_token: access,
    refresh_token: "refresh-token-value",
    realmId: "123456789",
    company_name: "Mills",
    expires_at: now + 60 * 60 * 1000,
    refresh_token_expires_at: now + 100 * 24 * 60 * 60 * 1000,
    connected_at: "2026-08-21T17:40:00.000Z",
    updated_at: "2026-08-21T17:40:00.000Z",
    needs_reauth: false,
  };
}

function useEnv(): void {
  process.env.QBO_TOKEN_API_SECRET = "shared-secret-value";
  delete process.env.QBO_ALLOW_SHARED_SECRET;
  delete process.env.QBO_TOKEN_ENC_KEY;
  delete process.env.QBO_TOKEN_ENC_KEY_VERSION;
  delete process.env.QBO_TOKEN_ENC_KEYS;
}

afterEach(() => {
  for (const [key, value] of snapshot) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  setQboTestHooks(null);
  clearRateLimitTestOverrides();
  resetTokenCryptoWarningsForTests();
});

for (const key of ENV) snapshot.set(key, process.env[key]);

describe("token encryption", () => {
  it("keeps plaintext when the key is unset and encrypts on the next write", async () => {
    useEnv();
    const kv = createMemoryKv();
    setQboTestHooks({ kv });
    await saveQboTokens("mikemills-buck", tokenRecord());
    const rawPlain = String(await kv.get(qboClientKey("mikemills-buck")));
    assert.equal(rawPlain.includes("access-token-value"), true);
    assert.equal(tokenStorageLabel(rawPlain), "plaintext");

    const key = randomBytes(32).toString("base64");
    process.env.QBO_TOKEN_ENC_KEY = key;
    const read = await getQboTokens("mikemills-buck");
    assert.equal(read?.access_token, "access-token-value");
    assert.equal(String(await kv.get(qboClientKey("mikemills-buck"))).includes("access-token-value"), true);

    const upgraded = await upgradePlaintextToken("mikemills-buck");
    assert.equal(upgraded, "upgraded");
    const stored = String(await kv.get(qboClientKey("mikemills-buck")));
    assert.equal(stored.includes("access-token-value"), false);
    assert.equal(stored.includes("refresh-token-value"), false);
    assert.equal(tokenStorageLabel(stored), "v1");
    assert.equal((await getQboTokens("mikemills-buck"))?.access_token, "access-token-value");
  });

  it("rotates key versions without dropping an older record", () => {
    const older = randomBytes(32).toString("base64");
    const newer = randomBytes(32).toString("base64");
    process.env.QBO_TOKEN_ENC_KEY = older;
    process.env.QBO_TOKEN_ENC_KEY_VERSION = "1";
    const sealed = encodeTokenForStorage(tokenRecord("first-access"));
    assert.equal(sealed.includes("first-access"), false);

    process.env.QBO_TOKEN_ENC_KEY = newer;
    process.env.QBO_TOKEN_ENC_KEY_VERSION = "2";
    process.env.QBO_TOKEN_ENC_KEYS = `1:${older}`;
    assert.equal(decodeTokenFromStorage(sealed)?.access_token, "first-access");
    const resealed = encodeTokenForStorage(tokenRecord("second-access"));
    assert.equal(tokenStorageLabel(resealed), "v2");
    delete process.env.QBO_TOKEN_ENC_KEYS;
    assert.throws(() => decodeTokenFromStorage(sealed), QboCorruptRecordError);
    assert.equal(decodeTokenFromStorage(resealed)?.access_token, "second-access");
  });

  it("does not treat a tampered ciphertext as a token", () => {
    process.env.QBO_TOKEN_ENC_KEY = randomBytes(32).toString("base64");
    const sealed = JSON.parse(encodeTokenForStorage(tokenRecord())) as { ct: string };
    sealed.ct = createHash("sha256").update("tamper").digest("base64url");
    assert.throws(() => decodeTokenFromStorage(JSON.stringify(sealed)), QboCorruptRecordError);
  });
});

describe("rate limits and audit", () => {
  it("limits a slug without letting a failed login spend that budget", async () => {
    useEnv();
    const kv = createMemoryKv();
    setQboTestHooks({ kv });
    await saveQboTokens("mikemills-buck", tokenRecord("mills-access"));
    setQboTestHooks({ kv });
    setRateLimitTestOverride(RATE_LIMITS.tokenSlug.name, 1);

    const headers = { "x-real-ip": "203.0.113.10" };
    const ok = await tokenGet(
      new NextRequest("https://www.clarixhq.ai/api/qbo-token?client=mikemills-buck&secret=shared-secret-value", { headers }),
    );
    assert.equal(ok.status, 200);
    assert.equal((await ok.json()).accessToken, "mills-access");

    const limited = await tokenGet(
      new NextRequest("https://www.clarixhq.ai/api/qbo-token?client=mikemills-buck&secret=shared-secret-value", { headers }),
    );
    assert.equal(limited.status, 429);
    assert.deepEqual(await limited.json(), { error: true, reason: "rate_limited" });

    const otherIp = await tokenGet(
      new NextRequest("https://www.clarixhq.ai/api/qbo-token?client=mikemills-buck&secret=wrong", {
        headers: { "x-real-ip": "203.0.113.99" },
      }),
    );
    assert.equal(otherIp.status, 401);
    const audit = JSON.stringify(await kv.get(QBO_AUDIT_KEY));
    assert.match(audit, /auth_failure/);
    assert.equal(audit.includes("wrong"), false);
    assert.equal(audit.includes("shared-secret-value"), false);
    assert.equal(audit.includes("mills-access"), false);
  });

  it("fails open when the counter cannot be stored", async () => {
    const kv = createMemoryKv();
    setQboTestHooks({
      kv: {
        ...kv,
        async incr() {
          throw new Error("KV request failed");
        },
      },
    });
    const result = await consumeRateLimit({ name: "qbo-token-slug", id: "mikemills-buck", limit: 1, windowSeconds: 60 });
    assert.equal(result.ok, true);
  });

  it("records a key issue without the plaintext key", async () => {
    useEnv();
    const kv = createMemoryKv();
    setQboTestHooks({ kv });
    const issued = await issueClientApiKey("chp-primary", { rotate: false });
    assert.equal(issued.ok, true);
    if (!issued.ok) return;
    const audit = String(await kv.get(QBO_AUDIT_KEY));
    assert.match(audit, /key_issued/);
    assert.equal(audit.includes(issued.apiKey), false);
  });

  it("drops secrets that do not fit the audit shape", () => {
    const stored = sanitizeSecurityEvent({
      event: "auth_failure",
      slug: "../etc/passwd",
      ip: "203.0.113.8 secret",
      detail: "Bearer abc",
    });
    assert.equal(stored.slug, undefined);
    assert.equal(stored.ip, undefined);
    assert.equal(stored.detail, undefined);
    assert.equal(JSON.stringify(stored).includes("abc"), false);
  });

  it("uses the platform IP and not a spoofed forwarded list", () => {
    const headers = new Headers({
      "x-real-ip": "203.0.113.8",
      "x-forwarded-for": "1.2.3.4, 203.0.113.8",
    });
    assert.equal(clientIp(headers), "203.0.113.8");
  });
});

describe("intake and headers", () => {
  it("escapes intake HTML and rejects header injection", () => {
    const message = buildIntakeMessage({
      name: "Ada\r\nBcc: evil@example.com",
      email: "ada@example.com",
      day_to_day: `<script>alert(1)</script>`,
    });
    assert.ok(message);
    assert.equal(message.subject.includes("\n"), false);
    assert.equal(message.subject.includes("\r"), false);
    assert.equal(message.html.includes("<script>"), false);
    assert.match(message.html, /&lt;script&gt;/);
    assert.equal(buildIntakeMessage({ name: "x".repeat(5000), email: "a@b.co" }), null);
  });

  it("rate limits intake before sending mail", async () => {
    const kv = createMemoryKv();
    setQboTestHooks({ kv });
    setRateLimitTestOverride(RATE_LIMITS.intakeIp.name, 1);
    await consumeRateLimit({ ...RATE_LIMITS.intakeIp, id: "198.51.100.20" });
    const response = await intakePost(
      new NextRequest("https://www.clarixhq.ai/api/intake", {
        method: "POST",
        headers: { "content-type": "application/json", "x-real-ip": "198.51.100.20" },
        body: JSON.stringify({ name: "Ada", email: "ada@example.com" }),
      }),
    );
    assert.equal(response.status, 429);
    assert.deepEqual(await response.json(), { error: "rate_limited" });
  });

  it("sets browser headers that still allow the Intuit redirect", () => {
    const headers = Object.fromEntries(securityHeaders().map((header) => [header.key, header.value]));
    assert.match(headers["Strict-Transport-Security"], /max-age=31536000/);
    assert.equal(headers["X-Content-Type-Options"], "nosniff");
    assert.equal(headers["X-Frame-Options"], "DENY");
    assert.equal(headers["Referrer-Policy"], "strict-origin-when-cross-origin");
    const csp = contentSecurityPolicy();
    assert.match(csp, /frame-ancestors 'none'/);
    assert.equal(csp.includes("navigate-to"), false);
    assert.match(csp, /form-action 'self'/);
    assert.equal(headers["Content-Security-Policy"], csp);
  });

  it("reports storage mode on the debug route and still omits tokens", async () => {
    useEnv();
    process.env.QBO_TOKEN_ENC_KEY = randomBytes(32).toString("base64");
    const kv = createMemoryKv();
    setQboTestHooks({ kv });
    await saveQboTokens("mikemills-buck", tokenRecord());
    setQboTestHooks({ kv });
    const response = await tokenDebugGet(
      new NextRequest("https://www.clarixhq.ai/api/qbo-token-debug?slug=mikemills-buck", {
        headers: { "X-QBO-Shared-Secret": "shared-secret-value" },
      }),
    );
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.storage, "v1");
    assert.equal(JSON.stringify(body).includes("access-token-value"), false);
    assert.equal(JSON.stringify(body).includes("refresh-token-value"), false);
  });
});

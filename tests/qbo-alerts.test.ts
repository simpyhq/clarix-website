import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { afterEach, describe, it } from "node:test";
import { NextRequest } from "next/server";
import { GET as healthGet } from "../app/api/cron/qbo-health/route";
import { AlertMessage, deliverAlertEmail, selectAlertProvider, setAlertMailTestDeps } from "../lib/qbo-alert-mail";
import { QBO_AUDIT_KEY, qboClientKey } from "../lib/qbo-keys";
import {
  buildHealthAlertContent,
  classifyRefreshExpiry,
  type HealthAlert,
} from "../lib/qbo-connection-health";
import { QboTokenRecord, refreshTokenExpiresAt } from "../lib/qbo-records";
import { setQboTestHooks } from "../lib/qbo-runtime";
import { getQboTokens, refreshQboToken, saveQboTokens } from "../lib/qbo-token-helper";
import { createMemoryKv } from "./memory-kv";

const DAY_MS = 24 * 60 * 60 * 1000;
const ENV = [
  "CRON_SECRET",
  "QBO_REDIRECT_URI",
  "QBO_CLIENT_ID",
  "QBO_CLIENT_SECRET",
  "QBO_TOKEN_ENC_KEY",
  "RESEND_API_KEY",
  "RESEND_FROM",
  "SMTP_USER",
  "SMTP_PASS",
] as const;
const snapshot = new Map<string, string | undefined>();
for (const key of ENV) snapshot.set(key, process.env[key]);

afterEach(() => {
  for (const [key, value] of snapshot) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  setQboTestHooks(null);
  setAlertMailTestDeps(null);
});

function tokenRecord(overrides: Partial<QboTokenRecord> = {}): QboTokenRecord {
  const now = Date.now();
  return {
    access_token: "access-SECRET-value",
    refresh_token: "refresh-SECRET-value",
    realmId: "123456789",
    company_name: "Mills Wealth",
    expires_at: now + 60 * 60 * 1000,
    refresh_token_expires_at: now + 100 * DAY_MS,
    connected_at: "2026-08-21T17:40:00.000Z",
    updated_at: "2026-08-21T17:40:00.000Z",
    needs_reauth: false,
    ...overrides,
  };
}

function withoutExpiry(overrides: Partial<QboTokenRecord> = {}): QboTokenRecord {
  const record = tokenRecord(overrides);
  delete record.refresh_token_expires_at;
  return record;
}

describe("refresh expiry classification", () => {
  const now = Date.parse("2026-09-28T15:00:00.000Z");

  function at(offsetMs: number | null, needsReauth = false) {
    return classifyRefreshExpiry(
      {
        needs_reauth: needsReauth,
        refresh_token_expires_at: offsetMs === null ? undefined : now + offsetMs,
      },
      now,
    );
  }

  it("marks 7 days urgent, 14 days warning, and later dates healthy", () => {
    assert.deepEqual(at(15 * DAY_MS), { status: "healthy", daysRemaining: 15 });
    assert.deepEqual(at(14 * DAY_MS + 1), { status: "healthy", daysRemaining: 15 });
    assert.deepEqual(at(14 * DAY_MS), { status: "warning", daysRemaining: 14 });
    assert.deepEqual(at(8 * DAY_MS), { status: "warning", daysRemaining: 8 });
    assert.deepEqual(at(7 * DAY_MS + 1), { status: "warning", daysRemaining: 8 });
    assert.deepEqual(at(7 * DAY_MS), { status: "urgent", daysRemaining: 7 });
    assert.deepEqual(at(3 * DAY_MS), { status: "urgent", daysRemaining: 3 });
    assert.deepEqual(at(60 * 60 * 1000), { status: "urgent", daysRemaining: 1 });
  });

  it("treats a past expiry or needs_reauth as dead, and a missing expiry as unknown", () => {
    assert.deepEqual(at(0), { status: "dead", daysRemaining: 0 });
    assert.deepEqual(at(-1), { status: "dead", daysRemaining: 0 });
    assert.deepEqual(at(-2 * DAY_MS), { status: "dead", daysRemaining: -2 });
    assert.deepEqual(at(90 * DAY_MS, true), { status: "dead", daysRemaining: 90 });
    assert.deepEqual(at(null, true), { status: "dead", daysRemaining: null });
    assert.deepEqual(at(null), { status: "unknown", daysRemaining: null });
    assert.deepEqual(
      classifyRefreshExpiry({ refresh_token_expires_at: Number.NaN }, now),
      { status: "unknown", daysRemaining: null },
    );
    assert.deepEqual(
      classifyRefreshExpiry({ refresh_token_expires_at: Number.POSITIVE_INFINITY }, now),
      { status: "unknown", daysRemaining: null },
    );
  });

  it("stores Intuit's refresh lifetime, and 100 days when that field is omitted", () => {
    const nowMs = 1_700_000_000_000;
    assert.equal(refreshTokenExpiresAt(nowMs, 10 * 24 * 3600), nowMs + 10 * DAY_MS);
    assert.equal(refreshTokenExpiresAt(nowMs, undefined), nowMs + 100 * DAY_MS);
    assert.equal(refreshTokenExpiresAt(nowMs, "8726400"), nowMs + 100 * DAY_MS);
    assert.equal(refreshTokenExpiresAt(nowMs, 0), nowMs);
  });
});

describe("alert email provider", () => {
  const message: AlertMessage = {
    from: "Clarix QBO Health <support@clarixhq.ai>",
    to: ["michael@ospipe.com"],
    cc: ["christian.simpson.2018@outlook.com"],
    subject: "Clarix QBO Health Alert — 1 client(s) need attention",
    text: "status: urgent",
    html: "<p>status: urgent</p>",
  };

  it("uses Resend only when the key is set, and SMTP otherwise", async () => {
    assert.equal(selectAlertProvider({}), "smtp");
    assert.equal(selectAlertProvider({ RESEND_API_KEY: "" }), "smtp");
    assert.equal(selectAlertProvider({ RESEND_API_KEY: "   " }), "smtp");
    assert.equal(selectAlertProvider({ RESEND_API_KEY: "re_test_key" }), "resend");

    let smtpCalls = 0;
    let resendCalls = 0;
    const smtp = async () => {
      smtpCalls += 1;
    };
    const resend = async (input: RequestInfo | URL, init?: RequestInit) => {
      resendCalls += 1;
      assert.equal(String(input), "https://api.resend.com/emails");
      const headers = new Headers(init?.headers);
      assert.equal(headers.get("authorization"), "Bearer re_test_key");
      const body = JSON.parse(String(init?.body)) as { from: string; text: string };
      assert.equal(JSON.stringify(body).includes("re_test_key"), false);
      assert.equal(body.from, "Clarix QBO Health <support@clarixhq.ai>");
      assert.equal(body.text, message.text);
      return new Response(JSON.stringify({ id: "email_123" }), { status: 200 });
    };

    const sent = await deliverAlertEmail(message, {
      env: { RESEND_API_KEY: "re_test_key" },
      fetchImpl: resend,
      sendSmtp: smtp,
    });
    assert.deepEqual(sent, { ok: true, provider: "resend" });
    assert.equal(resendCalls, 1);
    assert.equal(smtpCalls, 0);

    const fallback = await deliverAlertEmail(message, {
      env: { RESEND_API_KEY: "  " },
      fetchImpl: async () => {
        throw new Error("Resend must not be called");
      },
      sendSmtp: smtp,
    });
    assert.deepEqual(fallback, { ok: true, provider: "smtp" });
    assert.equal(smtpCalls, 1);
    assert.equal(resendCalls, 1);
  });

  it("reports SMTP 535 and Resend HTTP failures without falling through", async () => {
    let smtpCalls = 0;
    const smtpFailure = await deliverAlertEmail(message, {
      env: {},
      sendSmtp: async () => {
        smtpCalls += 1;
        const err = new Error("535-5.7.8 Username and Password not accepted") as Error & { responseCode: number };
        err.responseCode = 535;
        throw err;
      },
      fetchImpl: async () => {
        throw new Error("Resend must not be called");
      },
    });
    assert.deepEqual(smtpFailure, { ok: false, provider: "smtp", code: "smtp_535" });
    assert.equal(smtpCalls, 1);

    let smtpAfterResend = 0;
    const resendFailure = await deliverAlertEmail(message, {
      env: { RESEND_API_KEY: "re_test_key", RESEND_FROM: "alerts@clarixhq.ai" },
      fetchImpl: async () => new Response("nope", { status: 403 }),
      sendSmtp: async () => {
        smtpAfterResend += 1;
      },
    });
    assert.deepEqual(resendFailure, { ok: false, provider: "resend", code: "resend_http_403" });
    assert.equal(smtpAfterResend, 0);

    const badFrom = await deliverAlertEmail(message, {
      env: { RESEND_API_KEY: "re_test_key", RESEND_FROM: "bad\r\nBcc: evil@example.com" },
      fetchImpl: async () => {
        throw new Error("Resend must not be called");
      },
    });
    assert.deepEqual(badFrom, { ok: false, provider: "resend", code: "resend_from_invalid" });
  });

  it("escapes alert HTML", () => {
    const alert: HealthAlert = {
      slug: "dead-co",
      status: "dead",
      daysRemaining: null,
      detail: `<script>alert(1)</script>`,
      connectUrl: `https://www.clarixhq.ai/qbo/connect?client=dead-co&x="><img>`,
    };
    const content = buildHealthAlertContent([alert]);
    assert.equal(content.html.includes("<script>"), false);
    assert.equal(content.html.includes("><img>"), false);
    assert.match(content.html, /&lt;script&gt;/);
    assert.match(content.text, /days remaining: unknown/);
    assert.match(content.text, /status: dead/);
    assert.match(content.subject, /1 client/);
  });
});

describe("health cron alerts", () => {
  function armMail() {
    const smtp: AlertMessage[] = [];
    let resendCalls = 0;
    setAlertMailTestDeps({
      sendSmtp: async (message) => {
        smtp.push(message);
      },
      fetchImpl: async () => {
        resendCalls += 1;
        return Response.json({ id: "email_1" });
      },
    });
    return {
      smtp,
      resendCalls: () => resendCalls,
    };
  }

  async function readJson(response: Response): Promise<Record<string, unknown>> {
    return (await response.json()) as Record<string, unknown>;
  }

  it("sends one email for dead, urgent, and warning clients and leaves unknown out of it", async () => {
    process.env.CRON_SECRET = "cron-secret-value";
    process.env.QBO_REDIRECT_URI = "https://www.clarixhq.ai/qbo/callback";
    delete process.env.RESEND_API_KEY;
    const kv = createMemoryKv();
    const now = Date.now();
    setQboTestHooks({ kv });
    await saveQboTokens("warning-co", tokenRecord({ refresh_token_expires_at: now + 10 * DAY_MS }));
    await saveQboTokens("urgent-co", tokenRecord({ refresh_token_expires_at: now + 3 * DAY_MS }));
    await saveQboTokens("dead-co", withoutExpiry({ needs_reauth: true, last_refresh_error: "invalid_grant" }));
    await saveQboTokens("healthy-co", tokenRecord({ refresh_token_expires_at: now + 40 * DAY_MS }));
    await saveQboTokens("legacy-co", withoutExpiry());
    const mail = armMail();

    const response = await healthGet(
      new NextRequest("https://www.clarixhq.ai/api/cron/qbo-health", {
        headers: { Authorization: "Bearer cron-secret-value" },
      }),
    );
    const body = await readJson(response);
    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.alerts_found, 3);
    assert.equal(body.alert_delivery, "sent");
    assert.equal(body.alert_provider, "smtp");
    assert.equal("alert_delivery_code" in body, false);
    assert.deepEqual(
      (body.alerts as { slug: string; status: string }[]).map((alert) => `${alert.slug}:${alert.status}`),
      ["dead-co:dead", "urgent-co:urgent", "warning-co:warning"],
    );
    const connections = body.connections as { slug: string; status: string; days_remaining: number | null; note?: string }[];
    const legacy = connections.find((item) => item.slug === "legacy-co");
    assert.equal(legacy?.status, "unknown");
    assert.equal(legacy?.days_remaining, null);
    assert.equal(legacy?.note, "next_refresh_records_expiry");
    assert.equal(mail.resendCalls(), 0);
    assert.equal(mail.smtp.length, 1);
    const text = mail.smtp[0].text;
    assert.match(text, /dead-co/);
    assert.match(text, /status: dead/);
    assert.match(text, /days remaining: unknown/);
    assert.match(text, /urgent-co/);
    assert.match(text, /status: urgent/);
    assert.match(text, /days remaining: 3/);
    assert.match(text, /warning-co/);
    assert.match(text, /status: warning/);
    assert.match(text, /https:\/\/www\.clarixhq\.ai\/qbo\/connect\?client=dead-co/);
    assert.match(text, /https:\/\/www\.clarixhq\.ai\/qbo\/connect\?client=urgent-co/);
    assert.equal(text.includes("legacy-co"), false);
    assert.equal(text.includes("healthy-co"), false);
    assert.equal(text.includes("access-SECRET-value"), false);
    assert.equal(text.includes("refresh-SECRET-value"), false);
    assert.equal(text.includes("123456789"), false);
    assert.equal(mail.smtp[0].html.includes("access-SECRET-value"), false);
    assert.equal(mail.smtp[0].html.includes("123456789"), false);
    assert.deepEqual(mail.smtp[0].to, ["michael@ospipe.com", "christian@clarixhq.ai"]);
    assert.equal(JSON.stringify(body).includes("access-SECRET-value"), false);
    assert.equal(JSON.stringify(body).includes("refresh-SECRET-value"), false);
    assert.equal(JSON.stringify(body).includes("123456789"), false);
  });

  it("stays HTTP 200 when SMTP rejects the login and records the failure", async () => {
    process.env.CRON_SECRET = "cron-secret-value";
    process.env.QBO_REDIRECT_URI = "https://www.clarixhq.ai/qbo/callback";
    delete process.env.RESEND_API_KEY;
    const kv = createMemoryKv();
    setQboTestHooks({ kv });
    await saveQboTokens("dead-co", withoutExpiry({ needs_reauth: true, last_refresh_error: "invalid_grant" }));
    setAlertMailTestDeps({
      sendSmtp: async () => {
        const err = new Error("535-5.7.8 Username and Password not accepted") as Error & {
          responseCode: number;
        };
        err.responseCode = 535;
        throw err;
      },
    });
    const errors: string[] = [];
    const original = console.error;
    console.error = (...args: unknown[]) => {
      errors.push(args.map((arg) => String(arg)).join(" "));
    };
    try {
      const response = await healthGet(
        new NextRequest("https://www.clarixhq.ai/api/cron/qbo-health", {
          headers: { Authorization: "Bearer cron-secret-value" },
        }),
      );
      const body = await readJson(response);
      assert.equal(response.status, 200);
      assert.equal(body.ok, true);
      assert.equal(body.alert_delivery, "failed");
      assert.equal(body.alert_provider, "smtp");
      assert.equal(body.alert_delivery_code, "smtp_535");
      assert.equal(body.alerts_found, 1);
    } finally {
      console.error = original;
    }
    assert.equal(errors.some((line) => line.includes("QBO_ALERT_DELIVERY_FAILED provider=smtp code=smtp_535")), true);
    assert.equal(errors.some((line) => line.includes("Username and Password")), false);
    assert.equal(errors.some((line) => line.includes("access-SECRET-value")), false);
    const raw = await kv.get(QBO_AUDIT_KEY);
    const events = (JSON.parse(String(raw)) as string[]).map(
      (item) => JSON.parse(item) as { event: string; detail?: string },
    );
    assert.equal(events[0].event, "alert_delivery_failed");
    assert.equal(events[0].detail, "smtp_535");
    assert.equal(JSON.stringify(events).includes("SECRET"), false);
  });

  it("uses Resend for the cron when the key is set", async () => {
    process.env.CRON_SECRET = "cron-secret-value";
    process.env.QBO_REDIRECT_URI = "https://www.clarixhq.ai/qbo/callback";
    process.env.RESEND_API_KEY = "re_test_key_value";
    const kv = createMemoryKv();
    setQboTestHooks({ kv });
    await saveQboTokens("urgent-co", tokenRecord({ refresh_token_expires_at: Date.now() + 2 * DAY_MS }));
    let sawKeyInBody = false;
    let smtpCalls = 0;
    setAlertMailTestDeps({
      fetchImpl: async (_input, init) => {
        const body = String(init?.body);
        sawKeyInBody = body.includes("re_test_key_value");
        const headers = new Headers(init?.headers);
        assert.equal(headers.get("authorization"), "Bearer re_test_key_value");
        return Response.json({ id: "email_9" });
      },
      sendSmtp: async () => {
        smtpCalls += 1;
      },
    });
    const response = await healthGet(
      new NextRequest("https://www.clarixhq.ai/api/cron/qbo-health", {
        headers: { Authorization: "Bearer cron-secret-value" },
      }),
    );
    const body = await readJson(response);
    assert.equal(response.status, 200);
    assert.equal(body.alert_delivery, "sent");
    assert.equal(body.alert_provider, "resend");
    assert.equal(smtpCalls, 0);
    assert.equal(sawKeyInBody, false);
    assert.equal(JSON.stringify(body).includes("re_test_key_value"), false);
  });

  it("keeps an old encrypted record readable and fills expiry on the next refresh", async () => {
    process.env.QBO_TOKEN_ENC_KEY = randomBytes(32).toString("base64");
    process.env.QBO_CLIENT_ID = "client-id";
    process.env.QBO_CLIENT_SECRET = "client-secret";
    const kv = createMemoryKv();
    setQboTestHooks({ kv });
    await saveQboTokens("legacy-co", withoutExpiry({ expires_at: Date.now() - 1000 }));
    const raw = String(await kv.get(qboClientKey("legacy-co")));
    assert.equal(raw.includes("refresh-SECRET-value"), false);
    const loaded = await getQboTokens("legacy-co");
    assert.ok(loaded);
    assert.equal(loaded.refresh_token_expires_at, undefined);
    assert.equal(classifyRefreshExpiry(loaded || {}, Date.now()).status, "unknown");

    const lifetime = 10 * 24 * 3600;
    setQboTestHooks({
      kv,
      fetch: async (input) => {
        const url = String(input);
        if (url.includes("oauth.platform.intuit.com")) {
          return Response.json({
            access_token: "access-from-intuit",
            refresh_token: "refresh-from-intuit",
            expires_in: 3600,
            x_refresh_token_expires_in: lifetime,
          });
        }
        return new Response("unexpected", { status: 500 });
      },
    });
    const before = Date.now();
    const refreshed = await refreshQboToken("legacy-co");
    const after = Date.now();
    assert.equal(refreshed.ok, true);
    const stored = await getQboTokens("legacy-co");
    const expiry = stored?.refresh_token_expires_at;
    assert.equal(typeof expiry, "number");
    assert.ok(expiry !== undefined && expiry >= before + lifetime * 1000);
    assert.ok(expiry !== undefined && expiry <= after + lifetime * 1000);
    assert.equal(classifyRefreshExpiry(stored || {}, Date.now()).status, "warning");
    assert.equal(stored?.access_token, "access-from-intuit");
  });
});

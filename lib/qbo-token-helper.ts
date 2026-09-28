// Reads a usable QuickBooks Online access token from KV and refreshes it
// when it is expired or inside the 5-minute skew window.
//
// Intuit access tokens last 3600 seconds. Refresh tokens last 100 days on a
// rolling window that extends when they are used, and Intuit rotates the
// refresh token about every 24 hours (or on the next refresh after that).
// Callers therefore refresh on demand. The daily cron is the idle keep-alive.
//
// Refresh holds an owner-scoped lock and writes the new record with
// compare-and-set on a generation counter. An older refresh cannot overwrite
// a newer grant, and a process can only delete a lock it still owns.

import { randomUUID } from "crypto";
import { getQboKv } from "@/lib/qbo-kv";
import { QBO_CLIENTS_KEY, qboClientKey, qboGenKey, qboLockKey } from "@/lib/qbo-keys";
import {
  isServableAccessToken,
  parseGeneration,
  parseTokenRecord,
  QboCorruptRecordError,
  QboStorageError,
  QboTokenRecord,
} from "@/lib/qbo-records";
import { qboFetch, qboNow, qboTiming } from "@/lib/qbo-runtime";
import { isValidClientSlug, sanitizeIntuitFailure, SafeTokenDetail } from "@/lib/qbo-security";

export type { QboTokenRecord };

export type ValidAccessTokenResult =
  | { ok: true; accessToken: string; realmId: string }
  | { ok: false; reason: string; detail?: SafeTokenDetail };

export type RefreshFailureReason =
  | "not_connected"
  | "reauth_required"
  | "refresh_request_failed"
  | "refresh_in_progress";

export type RefreshResult = { ok: true } | { ok: false; reason: RefreshFailureReason; detail?: SafeTokenDetail };

const QBO_TOKEN_URL = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";
const REFRESH_SKEW_MS = 5 * 60 * 1000;
const FRESH_GRACE_MS = 2_000;

class IntuitRequestError extends Error {
  readonly safeCode: string;
  readonly invalidGrant: boolean;

  constructor(safeCode: string, invalidGrant: boolean) {
    super(safeCode);
    this.name = "IntuitRequestError";
    this.safeCode = safeCode;
    this.invalidGrant = invalidGrant;
  }
}

export function noConnectionReason(slug: string): string {
  return `no_connection: client "${slug}" has not connected QBO yet`;
}

function basicAuthHeader(): string {
  const id = process.env.QBO_CLIENT_ID || "";
  const secret = process.env.QBO_CLIENT_SECRET || "";
  return `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`;
}

function isTimeoutError(err: unknown): boolean {
  return err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
}

export async function intuitFetch(url: string, init: RequestInit = {}): Promise<Response> {
  return qboFetch(url, {
    ...init,
    signal: AbortSignal.timeout(qboTiming().intuitTimeoutMs),
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getQboTokens(slug: string): Promise<QboTokenRecord | null> {
  if (!isValidClientSlug(slug)) return null;
  const raw = await getQboKv().get(qboClientKey(slug));
  return parseTokenRecord(raw);
}

export async function saveQboTokens(slug: string, record: QboTokenRecord): Promise<void> {
  if (!isValidClientSlug(slug)) throw new QboStorageError("invalid client slug");
  await getQboKv().writeRecord(qboClientKey(slug), qboGenKey(slug), QBO_CLIENTS_KEY, JSON.stringify(record), slug);
}

export async function clearQboTokens(slug: string): Promise<void> {
  if (!isValidClientSlug(slug)) return;
  const kv = getQboKv();
  await kv.del(qboClientKey(slug));
  await kv.del(qboGenKey(slug));
  await kv.srem(QBO_CLIENTS_KEY, slug);
}

async function readGeneration(slug: string): Promise<number> {
  return parseGeneration(await getQboKv().get(qboGenKey(slug)));
}

async function casWrite(slug: string, expectedGen: number, record: QboTokenRecord): Promise<boolean> {
  return getQboKv().casRecord(qboClientKey(slug), qboGenKey(slug), String(expectedGen), JSON.stringify(record));
}

async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshTokenExpiresIn: number;
}> {
  let res: Response;
  try {
    res = await intuitFetch(QBO_TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: basicAuthHeader(),
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });
  } catch (err) {
    if (isTimeoutError(err)) throw new IntuitRequestError("http_timeout", false);
    throw new IntuitRequestError("http_0", false);
  }

  if (!res.ok) {
    const text = (await res.text()).slice(0, 2000);
    const sanitized = sanitizeIntuitFailure(res.status, text);
    throw new IntuitRequestError(sanitized.safeCode, sanitized.invalidGrant);
  }

  const data = (await res.json()) as {
    access_token?: unknown;
    refresh_token?: unknown;
    expires_in?: unknown;
    x_refresh_token_expires_in?: unknown;
  };
  if (typeof data.access_token !== "string" || typeof data.refresh_token !== "string") {
    throw new IntuitRequestError("http_200", false);
  }
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: typeof data.expires_in === "number" ? data.expires_in : 3600,
    refreshTokenExpiresIn:
      typeof data.x_refresh_token_expires_in === "number" ? data.x_refresh_token_expires_in : 100 * 24 * 3600,
  };
}

async function markReauth(
  slug: string,
  existing: QboTokenRecord,
  generation: number,
  safeCode: string,
  nowIso: string,
): Promise<"marked" | "superseded"> {
  const wrote = await casWrite(slug, generation, {
    ...existing,
    needs_reauth: true,
    last_refresh_error: safeCode,
    last_refresh_at: nowIso,
  });
  if (wrote) return "marked";
  const latest = await getQboTokens(slug);
  if (isServableAccessToken(latest, qboNow())) return "superseded";
  return "marked";
}

export async function refreshQboToken(slug: string): Promise<RefreshResult> {
  if (!isValidClientSlug(slug)) return { ok: false, reason: "not_connected" };

  const timing = qboTiming();
  const owner = randomUUID();
  const kv = getQboKv();
  let acquired = false;
  let waited = 0;

  try {
    while (!acquired && waited < timing.lockMaxWaitMs) {
      acquired = await kv.acquireLock(qboLockKey(slug), owner, timing.lockTtlSeconds);
      if (!acquired) {
        await sleep(timing.lockWaitMs);
        waited += timing.lockWaitMs;
      }
    }

    if (!acquired) {
      const latest = await getQboTokens(slug);
      if (isServableAccessToken(latest, qboNow())) return { ok: true };
      return { ok: false, reason: "refresh_in_progress", detail: "retry" };
    }

    const existing = await getQboTokens(slug);
    const generation = await readGeneration(slug);
    if (!existing) return { ok: false, reason: "not_connected" };

    if (existing.needs_reauth) {
      return { ok: false, reason: "reauth_required", detail: "reauth_required" };
    }

    if (isServableAccessToken(existing, qboNow()) && existing.expires_at > qboNow() + FRESH_GRACE_MS) {
      return { ok: true };
    }

    const nowIso = new Date(qboNow()).toISOString();
    if (typeof existing.refresh_token_expires_at === "number" && qboNow() >= existing.refresh_token_expires_at) {
      const marked = await markReauth(slug, existing, generation, "refresh_token_expired", nowIso);
      if (marked === "superseded") return { ok: true };
      return { ok: false, reason: "reauth_required", detail: "reauth_required" };
    }

    let refreshed: Awaited<ReturnType<typeof refreshAccessToken>>;
    try {
      refreshed = await refreshAccessToken(existing.refresh_token);
    } catch (err) {
      if (!(err instanceof IntuitRequestError)) throw err;
      console.error(`QBO refresh failed for client "${slug}": ${err.safeCode}`);
      if (err.invalidGrant) {
        const marked = await markReauth(slug, existing, generation, err.safeCode, nowIso);
        if (marked === "superseded") return { ok: true };
        return { ok: false, reason: "reauth_required", detail: "reauth_required" };
      }
      try {
        await casWrite(slug, generation, {
          ...existing,
          last_refresh_error: err.safeCode,
          last_refresh_at: nowIso,
        });
      } catch (writeErr) {
        if (!(writeErr instanceof QboStorageError) && !(writeErr instanceof QboCorruptRecordError)) throw writeErr;
      }
      return { ok: false, reason: "refresh_request_failed", detail: "refresh_request_failed" };
    }

    const now = qboNow();
    const updated: QboTokenRecord = {
      ...existing,
      access_token: refreshed.accessToken,
      refresh_token: refreshed.refreshToken,
      realmId: existing.realmId,
      expires_at: now + refreshed.expiresIn * 1000,
      refresh_token_expires_at: now + refreshed.refreshTokenExpiresIn * 1000,
      updated_at: new Date(now).toISOString(),
      last_refresh_at: new Date(now).toISOString(),
      needs_reauth: false,
    };
    delete updated.last_refresh_error;

    const wrote = await casWrite(slug, generation, updated);
    if (!wrote) {
      const latest = await getQboTokens(slug);
      if (isServableAccessToken(latest, qboNow())) return { ok: true };
      return { ok: false, reason: "refresh_in_progress", detail: "retry" };
    }

    console.log(`QBO token refreshed for client "${slug}"`);
    return { ok: true };
  } finally {
    if (acquired) {
      try {
        await kv.releaseLock(qboLockKey(slug), owner);
      } catch {
        // The lock TTL releases it if this process dies or the delete fails.
      }
    }
  }
}

export async function getValidAccessToken(clientSlug: string): Promise<ValidAccessTokenResult> {
  if (!isValidClientSlug(clientSlug)) {
    return { ok: false, reason: noConnectionReason(clientSlug.slice(0, 64)) };
  }

  let record: QboTokenRecord | null;
  try {
    record = await getQboTokens(clientSlug);
  } catch (err) {
    if (err instanceof QboCorruptRecordError) return { ok: false, reason: "corrupted_record" };
    console.error("QBO token helper: KV read error", err instanceof Error ? err.name : "error");
    return { ok: false, reason: "storage_error" };
  }

  if (!record) return { ok: false, reason: noConnectionReason(clientSlug) };
  if (!record.access_token || !record.refresh_token || !record.realmId) {
    return { ok: false, reason: "corrupted_record" };
  }
  if (record.needs_reauth) {
    return { ok: false, reason: "refresh_failed", detail: "reauth_required" };
  }

  const now = qboNow();
  if (record.expires_at && now < record.expires_at - REFRESH_SKEW_MS && isServableAccessToken(record, now)) {
    return { ok: true, accessToken: record.access_token, realmId: record.realmId };
  }

  let refreshResult: RefreshResult;
  try {
    refreshResult = await refreshQboToken(clientSlug);
  } catch (err) {
    if (err instanceof QboCorruptRecordError) return { ok: false, reason: "corrupted_record" };
    console.error("QBO token helper: refresh storage error", err instanceof Error ? err.name : "error");
    return { ok: false, reason: "storage_error" };
  }

  let latest: QboTokenRecord | null = null;
  try {
    latest = await getQboTokens(clientSlug);
  } catch (err) {
    if (err instanceof QboCorruptRecordError) return { ok: false, reason: "corrupted_record" };
    return { ok: false, reason: "storage_error" };
  }

  if (isServableAccessToken(latest, qboNow())) {
    return { ok: true, accessToken: latest.access_token, realmId: latest.realmId };
  }

  if (!refreshResult.ok && refreshResult.reason === "reauth_required") {
    return { ok: false, reason: "refresh_failed", detail: "reauth_required" };
  }
  if (!refreshResult.ok && refreshResult.reason === "not_connected") {
    return { ok: false, reason: noConnectionReason(clientSlug) };
  }
  return { ok: false, reason: "refresh_in_progress", detail: "retry" };
}

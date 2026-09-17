// File: lib/qbo-token-helper.ts
//
// Reads a valid (not expired) QuickBooks Online access token from Vercel KV,
// refreshing it automatically via the QBO OAuth API if it's expired.
//
// This file is a PURE READER of KV storage — it never writes new connection
// data, only updates refreshed tokens in-place. The OAuth callback route
// (app/qbo/callback/route.ts) is the sole creator of token records.
//
// KV schema per client key "qbo:client:<clientSlug>" (matches the schema
// actually written by app/qbo/callback/route.ts — corrected 2026-08-21,
// this helper was previously reading the wrong key/field names and always
// returned "not connected" or "corrupted_record" for real, live clients):
//   {
//     access_token: string,
//     refresh_token: string,
//     realmId: string,
//     company_name?: string,             // company name from QBO CompanyInfo API
//     expires_at: number,                // epoch ms when access_token expires
//     refresh_token_expires_at: number,  // epoch ms when refresh_token expires (~100 days)
//     connected_at: string,              // ISO timestamp of initial connection
//     updated_at: string,                // ISO timestamp of last successful refresh/write
//     last_refresh_error?: string,       // Intuit error body/status from most recent FAILED refresh
//     last_refresh_at?: string,          // ISO timestamp of most recent refresh ATTEMPT
//     needs_reauth?: boolean,            // true = refresh_token dead, human must re-authorize
//   }

export type ValidAccessTokenResult =
  | { ok: true; accessToken: string; realmId: string }
  | { ok: false; reason: string; detail?: string };

export type RefreshFailureReason =
  | "not_connected"
  | "reauth_required"
  | "refresh_request_failed";

export type RefreshResult =
  | { ok: true }
  | { ok: false; reason: RefreshFailureReason; detail?: string };

// Internal type for the full token record shape (mirrors what's in KV).
export interface QboTokenRecord {
  access_token: string;
  refresh_token: string;
  realmId: string;
  company_name?: string;
  expires_at: number;
  refresh_token_expires_at: number;
  connected_at: string;
  updated_at: string;
  last_refresh_error?: string;
  last_refresh_at?: string;
  needs_reauth?: boolean;
}

const KV_REST_URL = process.env.KV_REST_API_URL || "";
const KV_REST_TOKEN = process.env.KV_REST_API_TOKEN || "";
const QBO_CLIENT_ID = process.env.QBO_CLIENT_ID || "";
const QBO_CLIENT_SECRET = process.env.QBO_CLIENT_SECRET || "";

const QBO_TOKEN_URL = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";
const BASIC_AUTH = Buffer.from(`${QBO_CLIENT_ID}:${QBO_CLIENT_SECRET}`).toString("base64");

// How close to expiry (in ms) before we proactively refresh.
const REFRESH_SKEW_MS = 5 * 60 * 1000; // 5 minutes

// Lock TTL: in case a process dies mid-refresh, the lock auto-releases.
const LOCK_TTL_SECONDS = 10;
const LOCK_WAIT_MS = 300;
const LOCK_MAX_WAIT_MS = 3000;

function kvKey(slug: string): string {
  return `qbo:client:${slug}`;
}

function lockKey(slug: string): string {
  return `qbo:lock:${slug}`;
}

/**
 * Fetch a raw value from Upstash KV REST API.
 */
async function kvGet(key: string): Promise<unknown> {
  const url = `${KV_REST_URL}/get/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${KV_REST_TOKEN}` },
  });
  if (!res.ok) throw new Error(`KV GET failed: ${res.status}`);
  const body = await res.json();
  if (body.result === null || body.result === undefined) return null;
  let parsed: unknown = body.result;
  for (let i = 0; i < 3 && typeof parsed === "string"; i++) {
    parsed = JSON.parse(parsed);
  }
  return parsed;
}

/**
 * Write a value to Upstash KV REST API.
 */
async function kvSet(key: string, value: unknown): Promise<void> {
  const url = `${KV_REST_URL}/set/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(value),
  });
  if (!res.ok) throw new Error(`KV SET failed: ${res.status}`);
}

/**
 * Atomic SET NX EX via Upstash KV REST API.
 * Returns true if the key was set (lock acquired), false if it already existed.
 */
async function kvSetNX(key: string, ttlSeconds: number): Promise<boolean> {
  const url = `${KV_REST_URL}/set/${encodeURIComponent(key)}?NX&EX=${ttlSeconds}`;
  // Use a simple timestamp as the value (not JSON-encoded — Upstash treats
  // the raw POST body as the string value for simple SET; for NX we use the
  // query-param form which pairs with raw body strings).
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_REST_TOKEN}`,
    },
    body: String(Date.now()),
  });
  if (!res.ok) throw new Error(`KV SET NX failed: ${res.status}`);
  const data = await res.json();
  // Upstash returns { result: "OK" } on success, null (or different) when NX blocks.
  return data?.result === "OK";
}

/**
 * Delete a key from Upstash KV REST API.
 */
async function kvDel(key: string): Promise<void> {
  const url = `${KV_REST_URL}/del/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${KV_REST_TOKEN}` },
  });
  if (!res.ok) throw new Error(`KV DEL failed: ${res.status}`);
  // Ignore the response body — DEL is fire-and-forget.
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Public helpers (for use by other routes — callback, admin, cron)
// ---------------------------------------------------------------------------

/**
 * Read the raw stored token record for a client, or null if never connected.
 */
export async function getQboTokens(slug: string): Promise<QboTokenRecord | null> {
  try {
    const record = (await kvGet(kvKey(slug))) as QboTokenRecord | null;
    return record ?? null;
  } catch {
    return null;
  }
}

/**
 * Persist a token record for a client.
 */
export async function saveQboTokens(slug: string, record: QboTokenRecord): Promise<void> {
  await kvSet(kvKey(slug), record);
}

/**
 * Remove all tokens for a client (force full re-authorization).
 */
export async function clearQboTokens(slug: string): Promise<void> {
  await kvDel(kvKey(slug));
}

// ---------------------------------------------------------------------------
// Token refresh with single-flight lock + error persistence
// ---------------------------------------------------------------------------

/**
 * Refresh an expired QBO access token using the stored refresh token.
 * Returns the full Intuit response including the new refresh_token (Intuit
 * ROTATES it on every refresh — the old one is invalidated).
 */
async function refreshAccessToken(
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string; expiresIn: number; refreshTokenExpiresIn: number }> {
  const uri = new URL("https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer");
  const res = await fetch(uri.toString(), {
    method: "POST",
    headers: {
      Authorization: `Basic ${BASIC_AUTH}`,
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    const err = new Error(`QBO refresh failed: ${res.status}`);
    (err as any).status = res.status;
    (err as any).body = errText;
    throw err;
  }

  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    refreshTokenExpiresIn: data.x_refresh_token_expires_in,
  };
}

/**
 * Attempt to acquire a per-client refresh lock. Returns true if acquired.
 */
async function acquireRefreshLock(slug: string): Promise<boolean> {
  try {
    return await kvSetNX(lockKey(slug), LOCK_TTL_SECONDS);
  } catch {
    return false;
  }
}

/**
 * Release a per-client refresh lock (best-effort).
 */
async function releaseRefreshLock(slug: string): Promise<void> {
  try {
    await kvDel(lockKey(slug));
  } catch {
    // Non-critical — the lock has a TTL and will auto-expire.
  }
}

/**
 * Low-level: refresh a client's QBO tokens unconditionally.
 *
 * Uses a single-flight lock so only one caller actually talks to Intuit for
 * a given client at a time. Callers that lose the lock race re-read KV and
 * return the (already-refreshed) record.
 *
 * This is the single normal entry point for refreshing — the cron job should
 * be the primary caller going forward.
 */
export async function refreshQboToken(slug: string): Promise<RefreshResult> {
  // --- Single-flight lock ---
  let acquiredLock = false;
  let waited = 0;

  while (!acquiredLock && waited < LOCK_MAX_WAIT_MS) {
    acquiredLock = await acquireRefreshLock(slug);
    if (!acquiredLock) {
      await sleep(LOCK_WAIT_MS);
      waited += LOCK_WAIT_MS;
    }
  }

  if (!acquiredLock) {
    // Could not get lock within timeout — re-read whatever is in KV.
    const latest = await getQboTokens(slug);
    if (latest) {
      return { ok: true };
    }
    return {
      ok: false,
      reason: "refresh_request_failed",
      detail: "Timed out waiting for concurrent refresh lock.",
    };
  }

  try {
    // Re-read KV now that we hold the lock — another caller may have just
    // completed a refresh in the microseconds between us checking and
    // acquiring the lock.
    const existing = await getQboTokens(slug);

    if (!existing) {
      return { ok: false, reason: "not_connected" };
    }

    // If another caller already refreshed, our lock race was harmless.
    // Check if the access token is still expired (give 2s grace for clock
    // skew from the locker's write).
    if (existing.expires_at > Date.now() + 2000) {
      // Token is already fresh — someone beat us to it and persisted.
      return { ok: true };
    }

    // If needs_reauth is already set, don't bother calling Intuit at all.
    if (existing.needs_reauth) {
      return {
        ok: false,
        reason: "reauth_required",
        detail: existing.last_refresh_error || "Client flagged needs_reauth.",
      };
    }

    // Refresh tokens expire ~100 days after issuance.
    if (Date.now() >= existing.refresh_token_expires_at) {
      const nowIso = new Date().toISOString();
      await saveQboTokens(slug, {
        ...existing,
        needs_reauth: true,
        last_refresh_error: "refresh_token_expired (~100 day lifetime, local check)",
        last_refresh_at: nowIso,
      });
      return {
        ok: false,
        reason: "reauth_required",
        detail: "Refresh token has expired (~100 day lifetime). Client must re-authorize.",
      };
    }

    // --- Call Intuit ---
    const refreshed = await refreshAccessToken(existing.refresh_token);
    const now = Date.now();
    const nowIso = new Date(now).toISOString();

    const updated: QboTokenRecord = {
      access_token: refreshed.accessToken,
      refresh_token: refreshed.refreshToken,      // Intuit rotated it — persist the NEW one
      realmId: existing.realmId,
      company_name: existing.company_name,
      expires_at: now + refreshed.expiresIn * 1000,
      refresh_token_expires_at: now + refreshed.refreshTokenExpiresIn * 1000,
      connected_at: existing.connected_at,
      updated_at: nowIso,
      last_refresh_error: undefined,
      last_refresh_at: nowIso,
      needs_reauth: false,
    };

    await saveQboTokens(slug, updated);

    console.log(`QBO token refreshed for client "${slug}" (realmId ${existing.realmId})`);
    return { ok: true };
  } catch (err: any) {
    const nowIso = new Date().toISOString();
    const status = err.status || 0;
    const errBody = err.body || (err instanceof Error ? err.message : String(err));
    const errorString = `HTTP ${status}: ${errBody}`;

    // Check for invalid_grant — this means the refresh token is dead and
    // the client must re-authorize.
    if (status === 400 && /invalid_grant/i.test(errBody)) {
      console.error(`QBO refresh failed for client "${slug}": invalid_grant`);
      try {
        const existing = await getQboTokens(slug);
        if (existing) {
          await saveQboTokens(slug, {
            ...existing,
            needs_reauth: true,
            last_refresh_error: errorString,
            last_refresh_at: nowIso,
          });
        }
      } catch {
        // Non-critical — best-effort error persistence.
      }
      return {
        ok: false,
        reason: "reauth_required",
        detail: errorString,
      };
    }

    // For any other error, persist it but leave needs_reauth unchanged.
    console.error(`QBO refresh failed for client "${slug}":`, status, errBody);
    try {
      const existing = await getQboTokens(slug);
      if (existing) {
        await saveQboTokens(slug, {
          ...existing,
          last_refresh_error: errorString,
          last_refresh_at: nowIso,
        });
      }
    } catch {
      // Non-critical.
    }

    return {
      ok: false,
      reason: "refresh_request_failed",
      detail: errorString,
    };
  } finally {
    await releaseRefreshLock(slug);
  }
}

// ---------------------------------------------------------------------------
// Public entry point: get a valid token (auto-refresh if needed)
// ---------------------------------------------------------------------------

/**
 * Retrieve a valid (refreshed if necessary) QBO access token for the given
 * client slug. Returns { ok: true, accessToken, realmId } on success, or
 * { ok: false, reason } if the client has no stored connection or the
 * refresh token itself has expired.
 */
export async function getValidAccessToken(
  clientSlug: string,
): Promise<ValidAccessTokenResult> {
  let record: QboTokenRecord | null;
  try {
    record = await getQboTokens(clientSlug);
  } catch (err) {
    console.error("QBO token helper: KV read error:", err);
    return { ok: false, reason: "storage_error" };
  }

  if (!record) {
    return {
      ok: false,
      reason: `no_connection: client "${clientSlug}" has not connected QBO yet`,
    };
  }

  const {
    access_token: accessToken,
    refresh_token: refreshToken,
    realmId,
    expires_at: expiresAt,
    needs_reauth: needsReauth,
  } = record as QboTokenRecord;

  if (!accessToken || !refreshToken || !realmId) {
    return { ok: false, reason: "corrupted_record" };
  }

  // If already flagged as needing re-auth, short-circuit immediately.
  if (needsReauth) {
    return {
      ok: false,
      reason: "refresh_failed",
      detail: record.last_refresh_error || "Client needs re-authorization.",
    };
  }

  // If the token is still valid (with 5-minute buffer), return it directly.
  const now = Date.now();
  if (expiresAt && now < expiresAt - REFRESH_SKEW_MS) {
    return { ok: true, accessToken, realmId };
  }

  // Token is expired (or close to it) — refresh it.
  const refreshResult = await refreshQboToken(clientSlug);

  if (!refreshResult.ok) {
    console.error(
      "QBO token helper: refresh failed for client:",
      clientSlug,
      refreshResult.reason,
      refreshResult.detail
    );
    return { ok: false, reason: "refresh_failed", detail: refreshResult.detail };
  }

  // Re-read the refreshed record to get the new access token.
  const refreshedRecord = await getQboTokens(clientSlug);
  if (!refreshedRecord?.access_token) {
    return { ok: false, reason: "refresh_failed", detail: "Refresh completed but record vanished." };
  }

  return { ok: true, accessToken: refreshedRecord.access_token, realmId: refreshedRecord.realmId };
}
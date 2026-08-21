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
//     expires_at: number,               // epoch ms when access_token expires
//     refresh_token_expires_at: number, // epoch ms when refresh_token expires (~100 days)
//     connected_at: string,             // ISO timestamp of initial connection
//     updated_at: string,               // ISO timestamp of last successful refresh/write
//   }

export type ValidAccessTokenResult =
  | { ok: true; accessToken: string; realmId: string }
  | { ok: false; reason: string };

const KV_REST_URL = process.env.KV_REST_API_URL || "";
const KV_REST_TOKEN = process.env.KV_REST_API_TOKEN || "";
const QBO_CLIENT_ID = process.env.QBO_CLIENT_ID || "";
const QBO_CLIENT_SECRET = process.env.QBO_CLIENT_SECRET || "";

const QBO_TOKEN_URL = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";
const BASIC_AUTH = Buffer.from(`${QBO_CLIENT_ID}:${QBO_CLIENT_SECRET}`).toString("base64");

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
  // Upstash returns { result: <value | null> }
  if (body.result === null || body.result === undefined) return null;
  // Client tokens are stored as JSON strings, but some existing records were
  // written double-encoded (JSON.stringify'd twice) by an earlier version of
  // kvSet. Parse repeatedly until we land on an object (or give up after a
  // few tries) so both single- and double-encoded legacy records read
  // correctly — fixed 2026-08-21 after a refresh-and-persist cycle wrote a
  // double-encoded record that then failed to parse back into fields
  // (corrupted_record) on the very next read.
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
    // Single-encode only — previously this double-stringified (bug), which
    // produced records kvGet's old single-parse couldn't read back correctly
    // after a refresh cycle. kvGet now tolerates both old double-encoded and
    // new single-encoded records, but new writes should be single-encoded
    // going forward.
    body: JSON.stringify(value),
  });
  if (!res.ok) throw new Error(`KV SET failed: ${res.status}`);
}

/**
 * Refresh an expired QBO access token using the stored refresh token.
 */
async function refreshAccessToken(
  refreshToken: string,
): Promise<{ accessToken: string; expiresIn: number }> {
  const res = await fetch(QBO_TOKEN_URL, {
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
    console.error("QBO refresh failed:", res.status, errText);
    throw new Error(`QBO refresh failed: ${res.status}`);
  }

  const data = await res.json();
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in, // seconds
  };
}

/**
 * Retrieve a valid (refreshed if necessary) QBO access token for the given
 * client slug. Returns { ok: true, accessToken, realmId } on success, or
 * { ok: false, reason } if the client has no stored connection or the
 * refresh token itself has expired.
 */
export async function getValidAccessToken(
  clientSlug: string,
): Promise<ValidAccessTokenResult> {
  const kvKey = `qbo:client:${clientSlug}`;

  let record: Record<string, unknown> | null;
  try {
    record = (await kvGet(kvKey)) as Record<string, unknown> | null;
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
    refresh_token_expires_at: refreshTokenExpiresAt,
    connected_at: connectedAt,
  } = record as {
    access_token?: string;
    refresh_token?: string;
    realmId?: string;
    expires_at?: number;
    refresh_token_expires_at?: number;
    connected_at?: string;
  };

  if (!accessToken || !refreshToken || !realmId) {
    return { ok: false, reason: "corrupted_record" };
  }

  // If the token is still valid (with 5-minute buffer), return it directly.
  const now = Date.now();
  const fiveMinMs = 5 * 60 * 1000;
  if (expiresAt && now < expiresAt - fiveMinMs) {
    return { ok: true, accessToken, realmId };
  }

  // Token is expired (or close to it) — refresh it.
  try {
    const refreshed = await refreshAccessToken(refreshToken);
    const newExpiresAt = now + refreshed.expiresIn * 1000;

    // Store the refreshed token back in KV, preserving fields this helper
    // doesn't own (connected_at, refresh_token_expires_at) rather than
    // dropping them on every refresh.
    const updatedRecord = {
      access_token: refreshed.accessToken,
      refresh_token: refreshToken,
      realmId,
      expires_at: newExpiresAt,
      refresh_token_expires_at: refreshTokenExpiresAt,
      connected_at: connectedAt,
      updated_at: new Date(now).toISOString(),
    };

    try {
      await kvSet(kvKey, updatedRecord);
    } catch (setErr) {
      // Non-critical: we can still return the refreshed token even if
      // persisting it fails (the next call will refresh again).
      console.error("QBO token helper: failed to persist refreshed token:", setErr);
    }

    return { ok: true, accessToken: refreshed.accessToken, realmId };
  } catch (err) {
    console.error("QBO token helper: refresh failed for client:", clientSlug, err);
    return { ok: false, reason: "refresh_failed" };
  }
}
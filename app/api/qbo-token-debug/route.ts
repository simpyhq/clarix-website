// Metadata for one client's QuickBooks connection. Never returns tokens.
// Credentials belong in headers only. A query-string secret is rejected and
// is not used, because request URLs are written to access logs.
// X-QBO-Client-Key is scoped to this slug. X-QBO-Shared-Secret follows
// QBO_ALLOW_SHARED_SECRET.

import { NextRequest, NextResponse } from "next/server";
import { recordSecurityEvent } from "@/lib/qbo-audit";
import { decodeTokenFromStorage, tokenStorageLabel } from "@/lib/qbo-crypto";
import { getQboKv } from "@/lib/qbo-kv";
import { qboClientKey } from "@/lib/qbo-keys";
import { clientIp, consumeRateLimit, RATE_LIMITS } from "@/lib/qbo-rate-limit";
import { QboCorruptRecordError, QboStorageError } from "@/lib/qbo-records";
import { isValidClientSlug, publicRefreshError } from "@/lib/qbo-security";
import { authorizeQboApiRequest } from "@/lib/qbo-token-auth";

export const runtime = "nodejs";
export const maxDuration = 60;

const JSON_HEADERS = { "Cache-Control": "no-store" };

function json(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: JSON_HEADERS });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const ip = clientIp(request.headers);
  if (searchParams.has("secret")) {
    return json({ error: true, reason: "use_header" }, 400);
  }
  const ipLimit = await consumeRateLimit({ ...RATE_LIMITS.debugIp, id: ip });
  if (!ipLimit.ok) {
    await recordSecurityEvent({ event: "rate_limited", slug, ip, detail: "qbo-token-debug" });
    return json({ error: true, reason: "rate_limited" }, 429);
  }
  const auth = await authorizeQboApiRequest({
    slug,
    clientKey: request.headers.get("x-qbo-client-key"),
    sharedSecret: request.headers.get("x-qbo-shared-secret"),
  });
  if (auth === "storage_error") return json({ error: true, reason: "storage_error" });
  if (auth !== "ok") {
    await recordSecurityEvent({ event: "auth_failure", slug, ip, detail: "qbo-token-debug" });
    return json({ error: true }, 401);
  }
  if (!slug) return json({ error: true, reason: "missing_slug" });
  if (isValidClientSlug(slug)) {
    const slugLimit = await consumeRateLimit({ ...RATE_LIMITS.debugSlug, id: slug });
    if (!slugLimit.ok) {
      await recordSecurityEvent({ event: "rate_limited", slug, ip, detail: "qbo-token-debug" });
      return json({ error: true, reason: "rate_limited" }, 429);
    }
  }

  try {
    const raw = await getQboKv().get(qboClientKey(slug));
    const storage = tokenStorageLabel(raw);
    const record = decodeTokenFromStorage(raw);
    if (!record) return json({ slug, connected: false, storage });
    return json({
      slug,
      connected: true,
      storage,
      company_name: record.company_name || null,
      realmId: record.realmId,
      connected_at: record.connected_at,
      updated_at: record.updated_at,
      expires_at: record.expires_at,
      refresh_token_expires_at: record.refresh_token_expires_at,
      last_refresh_error: publicRefreshError(record.last_refresh_error) || null,
      last_refresh_at: record.last_refresh_at || null,
      needs_reauth: record.needs_reauth || false,
    });
  } catch (err) {
    if (err instanceof QboCorruptRecordError) return json({ error: true, reason: "corrupted_record" });
    if (err instanceof QboStorageError) return json({ error: true, reason: "storage_error" });
    throw err;
  }
}

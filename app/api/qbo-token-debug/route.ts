// Metadata for one client's QuickBooks connection. Never returns tokens.
// Accepts the same credentials as /api/qbo-token. A per-client key can only
// read that slug. The shared-secret query param follows QBO_ALLOW_SHARED_SECRET.

import { NextRequest, NextResponse } from "next/server";
import { QboCorruptRecordError, QboStorageError } from "@/lib/qbo-records";
import { publicRefreshError } from "@/lib/qbo-security";
import { authorizeQboApiRequest } from "@/lib/qbo-token-auth";
import { getQboTokens } from "@/lib/qbo-token-helper";

export const runtime = "nodejs";
export const maxDuration = 60;

const JSON_HEADERS = { "Cache-Control": "no-store" };

function json(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: JSON_HEADERS });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const auth = await authorizeQboApiRequest({
    slug,
    clientKey: request.headers.get("x-qbo-client-key"),
    sharedSecret: searchParams.get("secret") || request.headers.get("x-qbo-shared-secret"),
  });
  if (auth === "storage_error") return json({ error: true, reason: "storage_error" });
  if (auth !== "ok") return json({ error: true }, 401);
  if (!slug) return json({ error: true, reason: "missing_slug" });

  try {
    const record = await getQboTokens(slug);
    if (!record) return json({ slug, connected: false });
    return json({
      slug,
      connected: true,
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

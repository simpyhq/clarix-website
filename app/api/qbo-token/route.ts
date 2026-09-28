// Secret-gated token endpoint for Mac mini client agents.
//
// Legacy (still on unless QBO_ALLOW_SHARED_SECRET is false/0/no/off):
//   GET /api/qbo-token?client=<slug>&secret=<QBO_TOKEN_API_SECRET>
//
// Per-client key (preferred; scoped to that slug):
//   GET /api/qbo-token?client=<slug>
//   X-QBO-Client-Key: <key>
//
// The shared secret may also be sent as X-QBO-Shared-Secret instead of the
// query string. When X-QBO-Client-Key is present it is the only credential
// checked, even if it does not match.
//
// 200 { accessToken, realmId }
// 200 { error: true, reason, detail? }
// 401 { error: true }

import { NextRequest, NextResponse } from "next/server";
import { asSafeDetail } from "@/lib/qbo-security";
import { authorizeQboApiRequest } from "@/lib/qbo-token-auth";
import { getValidAccessToken } from "@/lib/qbo-token-helper";

export const runtime = "nodejs";
export const maxDuration = 60;

const JSON_HEADERS = {
  "Cache-Control": "no-store",
  Pragma: "no-cache",
};

function json(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: JSON_HEADERS });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const client = searchParams.get("client");
  const querySecret = searchParams.get("secret");
  const headerSecret = request.headers.get("x-qbo-shared-secret");
  const clientKey = request.headers.get("x-qbo-client-key");

  const auth = await authorizeQboApiRequest({
    slug: client,
    clientKey,
    sharedSecret: querySecret || headerSecret,
  });
  if (auth === "storage_error") {
    return json({ error: true, reason: "storage_error" });
  }
  if (auth !== "ok") {
    return json({ error: true }, 401);
  }

  if (!client) {
    return json({ error: true, reason: "missing_client" });
  }

  const result = await getValidAccessToken(client);
  if (!result.ok) {
    const body: { error: true; reason: string; detail?: string } = {
      error: true,
      reason: result.reason,
    };
    const detail = asSafeDetail(result.detail);
    if (detail) body.detail = detail;
    return json(body);
  }

  console.log("QBO token API: served token for client:", client);
  return json({
    accessToken: result.accessToken,
    realmId: result.realmId,
  });
}

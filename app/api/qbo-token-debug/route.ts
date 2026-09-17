// File: app/api/qbo-token-debug/route.ts
//
// Admin-only endpoint to read the last refresh error details for a client slug.
// Gated by the same QBO_TOKEN_API_SECRET used by /api/qbo-token.
//
// Usage:
//   GET /api/qbo-token-debug?slug=<slug>&secret=<QBO_TOKEN_API_SECRET>
//
// Response:
//   200 { slug, last_refresh_error, last_refresh_at, needs_reauth, company_name,
//         realmId, expires_at, refresh_token_expires_at, connected_at, updated_at }
//   401 { error: true }  — bad/missing secret

import { NextRequest, NextResponse } from "next/server";
import { getQboTokens } from "@/lib/qbo-token-helper";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const slug = searchParams.get("slug");
  const secret = searchParams.get("secret");

  const expectedSecret = process.env.QBO_TOKEN_API_SECRET;

  if (!expectedSecret || !secret || secret !== expectedSecret) {
    return NextResponse.json({ error: true }, { status: 401 });
  }

  if (!slug) {
    return NextResponse.json({ error: true, reason: "missing_slug" });
  }

  const record = await getQboTokens(slug);

  if (!record) {
    return NextResponse.json({ slug, connected: false });
  }

  // Return a safe subset — never expose actual access_token or refresh_token.
  return NextResponse.json({
    slug,
    connected: true,
    company_name: record.company_name || null,
    realmId: record.realmId,
    connected_at: record.connected_at,
    updated_at: record.updated_at,
    expires_at: record.expires_at,
    refresh_token_expires_at: record.refresh_token_expires_at,
    last_refresh_error: record.last_refresh_error || null,
    last_refresh_at: record.last_refresh_at || null,
    needs_reauth: record.needs_reauth || false,
  });
}
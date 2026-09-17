// TEMPORARY VERIFICATION ROUTE — not part of the permanent API surface.
// Calls refreshQboToken() unconditionally (bypasses the expires_at freshness
// check that the cron route and getValidAccessToken use) so we can capture
// the real Intuit error text for a specific slug on demand, for one-time
// post-deploy verification. Gated by QBO_TOKEN_API_SECRET like the other
// debug route. Delete this file after verification is complete.
//
// Usage: GET /api/qbo-force-refresh?slug=<slug>&secret=<QBO_TOKEN_API_SECRET>

import { NextRequest, NextResponse } from "next/server";
import { refreshQboToken, getQboTokens } from "@/lib/qbo-token-helper";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const secret = searchParams.get("secret");

  const expectedSecret = process.env.QBO_TOKEN_API_SECRET;
  if (!expectedSecret || !secret || secret !== expectedSecret) {
    return NextResponse.json({ error: true }, { status: 401 });
  }

  if (!slug) {
    return NextResponse.json({ error: true, reason: "missing_slug" }, { status: 400 });
  }

  const result = await refreshQboToken(slug);
  const record = await getQboTokens(slug);

  return NextResponse.json({
    slug,
    refreshResult: result,
    record_after: record,
  });
}

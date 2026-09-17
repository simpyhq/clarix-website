// File: app/api/cron/qbo-refresh/route.ts
//
// Vercel Cron job: runs at minute 40 of every hour via vercel.json
// ("0 40 * * * *"). Proactively refreshes every known QBO client's
// access token so that on-demand callers (agents, API routes) almost
// never need to block on a live refresh.
//
// This route is the PRIMARY normal caller of refreshQboToken(). Other
// code paths (getValidAccessToken) should fall through to refresh only
// as an on-demand safety net when the cron has drifted or a token
// expired prematurely.
//
// Protected by CRON_SECRET env var — Vercel sends this as a Bearer token
// in the Authorization header on cron invocations. Set CRON_SECRET to a
// long random value in Vercel project settings, and Vercel auto-injects
// it as the Authorization header for cron-triggered routes.

import { NextRequest, NextResponse } from "next/server";
import { getQboTokens, refreshQboToken } from "@/lib/qbo-token-helper";

// Known client slugs. This list is the source of truth for which clients
// get proactive refreshes. When a new client is onboarded, add their slug
// here and re-deploy.
const KNOWN_CLIENT_SLUGS = [
  "mikemills-buck",
  "tcre-capital-buck",
  "amtm-investments-buck",
];

export async function GET(request: NextRequest) {
  // Verify cron secret if configured.
  const authHeader = request.headers.get("Authorization") || "";
  const expectedSecret = process.env.CRON_SECRET;
  if (expectedSecret) {
    // Vercel sends: Authorization: Bearer <CRON_SECRET>
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (token !== expectedSecret) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const results: Record<string, unknown> = {};

  for (const slug of KNOWN_CLIENT_SLUGS) {
    try {
      const record = await getQboTokens(slug);
      if (!record) {
        results[slug] = { status: "not_connected" };
        continue;
      }

      // Only refresh if the token is within 1 hour of expiry (or already expired).
      // This avoids needless refresh calls when the token is still fresh.
      const oneHourMs = 60 * 60 * 1000;
      if (record.expires_at > Date.now() + oneHourMs) {
        results[slug] = { status: "still_fresh", expires_in_min: Math.floor((record.expires_at - Date.now()) / 60000) };
        continue;
      }

      const refreshResult = await refreshQboToken(slug);
      results[slug] = {
        status: refreshResult.ok ? "refreshed" : refreshResult.reason,
        detail: refreshResult.ok ? undefined : refreshResult.detail,
      };
    } catch (err) {
      results[slug] = { status: "error", detail: err instanceof Error ? err.message : String(err) };
    }
  }

  console.log("QBO cron refresh results:", JSON.stringify(results));

  return NextResponse.json({ ok: true, results });
}
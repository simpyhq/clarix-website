// Daily QuickBooks keep-alive. Vercel Hobby only allows cron expressions
// that run once per day (https://vercel.com/docs/cron-jobs/usage-and-pricing);
// an hourly expression fails the deployment. Intuit access tokens last one
// hour and are refreshed on demand by /api/qbo-token. Refresh tokens last
// 100 days, rolling forward each time they are used, and Intuit rotates the
// refresh token about every 24 hours. A daily refresh is enough to keep an
// idle connection alive and to persist that rotation.
//
// Hobby may invoke the job any time during the scheduled hour.
// Requires CRON_SECRET. Vercel sends Authorization: Bearer <CRON_SECRET>.

import { NextRequest, NextResponse } from "next/server";
import { listQboClientSlugs } from "@/lib/qbo-clients";
import { QboCorruptRecordError, QboStorageError } from "@/lib/qbo-records";
import { cronAuthorized } from "@/lib/qbo-security";
import { getQboTokens, refreshQboToken } from "@/lib/qbo-token-helper";

export const runtime = "nodejs";
export const maxDuration = 60;

const STILL_FRESH_MS = 5 * 60 * 1000;

export async function GET(request: NextRequest) {
  if (!cronAuthorized(request.headers.get("authorization"), process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  let slugs: string[];
  try {
    slugs = await listQboClientSlugs();
  } catch (err) {
    console.error("QBO cron refresh: client list failed", err instanceof Error ? err.name : "error");
    return NextResponse.json(
      { ok: false, error: "storage_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }

  const results: Record<string, { status: string }> = {};
  for (const slug of slugs) {
    try {
      const record = await getQboTokens(slug);
      if (!record) {
        results[slug] = { status: "not_connected" };
        continue;
      }
      if (!record.needs_reauth && record.expires_at > Date.now() + STILL_FRESH_MS) {
        results[slug] = { status: "still_fresh" };
        continue;
      }
      const refreshResult = await refreshQboToken(slug);
      results[slug] = { status: refreshResult.ok ? "refreshed" : refreshResult.reason };
    } catch (err) {
      if (err instanceof QboCorruptRecordError) {
        results[slug] = { status: "corrupted_record" };
      } else if (err instanceof QboStorageError) {
        results[slug] = { status: "storage_error" };
      } else {
        results[slug] = { status: "error" };
      }
    }
  }

  console.log(
    "QBO cron refresh results:",
    JSON.stringify(Object.fromEntries(Object.entries(results).map(([slug, value]) => [slug, value.status]))),
  );

  const failed = Object.values(results).some((item) => item.status === "storage_error");
  return NextResponse.json(
    { ok: !failed, results },
    { status: failed ? 500 : 200, headers: { "Cache-Control": "no-store" } },
  );
}

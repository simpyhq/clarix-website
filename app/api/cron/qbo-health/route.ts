// Daily QuickBooks health check. One email lists clients that are already
// dead, urgent (refresh token expires within 7 days), or warning (within 14
// days). Clients come from KV, not a hardcoded list. Requires CRON_SECRET.
//
// A mail failure is logged and written to qbo:audit. The HTTP status stays
// 200 so a rejected SMTP login cannot make Vercel drop the cron. Set
// RESEND_API_KEY to send through Resend; otherwise Gmail SMTP is used.
//
// Alerts go to michael@ospipe.com and christian@clarixhq.ai, with the
// existing outlook address on cc.

import { NextRequest, NextResponse } from "next/server";
import { deliverAlertEmail, DEFAULT_ALERT_FROM } from "@/lib/qbo-alert-mail";
import { recordSecurityEvent } from "@/lib/qbo-audit";
import { listQboClientSlugs } from "@/lib/qbo-clients";
import {
  buildHealthAlertContent,
  classifyRefreshExpiry,
  type HealthAlert,
  sortHealthAlerts,
} from "@/lib/qbo-connection-health";
import { qboConnectUrl } from "@/lib/qbo-oauth-state";
import { clientIp } from "@/lib/qbo-rate-limit";
import { QboStorageError } from "@/lib/qbo-records";
import { cronAuthorized, publicRefreshError } from "@/lib/qbo-security";
import { getQboTokens } from "@/lib/qbo-token-helper";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALERT_TO = ["michael@ospipe.com", "christian@clarixhq.ai"];
const ALERT_CC = ["christian.simpson.2018@outlook.com"];

function alertJsonDetail(alert: HealthAlert): string {
  if (alert.status === "urgent") return "expires_within_7_days";
  if (alert.status === "warning") return "expires_within_14_days";
  return alert.detail;
}

export async function GET(request: NextRequest) {
  if (!cronAuthorized(request.headers.get("authorization"), process.env.CRON_SECRET)) {
    await recordSecurityEvent({ event: "auth_failure", ip: clientIp(request.headers), detail: "qbo-cron-health" });
    return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  let slugs: string[];
  try {
    slugs = await listQboClientSlugs();
  } catch (err) {
    console.error("QBO health: client list failed", err instanceof Error ? err.name : "error");
    return NextResponse.json(
      { ok: false, error: "storage_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }

  const now = Date.now();
  const alerts: HealthAlert[] = [];
  const connections: {
    slug: string;
    status: string;
    days_remaining: number | null;
    note?: string;
  }[] = [];
  let storageFailed = false;

  for (const slug of slugs) {
    try {
      const record = await getQboTokens(slug);
      if (!record) continue;
      const health = classifyRefreshExpiry(record, now);
      connections.push({
        slug,
        status: health.status,
        days_remaining: health.daysRemaining,
        ...(health.status === "unknown" ? { note: "next_refresh_records_expiry" } : {}),
      });
      if (health.status === "unknown") {
        console.info(`QBO health: refresh expiry unknown for ${slug}; the next successful refresh records it`);
        continue;
      }
      if (health.status === "healthy") continue;
      alerts.push({
        slug,
        status: health.status,
        daysRemaining: health.daysRemaining,
        detail: publicRefreshError(record.last_refresh_error) || "refresh_token_invalid",
        connectUrl: qboConnectUrl(slug),
      });
    } catch (err) {
      if (err instanceof QboStorageError) storageFailed = true;
      console.error(`QBO health check error for ${slug}:`, err instanceof Error ? err.name : "error");
    }
  }

  const ordered = sortHealthAlerts(alerts);
  let alertDelivery: "not_needed" | "sent" | "failed" = "not_needed";
  let alertProvider: "resend" | "smtp" | null = null;
  let alertDeliveryCode: string | undefined;

  if (ordered.length > 0) {
    console.info(`QBO health alerts: ${ordered.map((alert) => `${alert.slug}=${alert.status}`).join(",")}`);
    const content = buildHealthAlertContent(ordered, new Date(now));
    const delivery = await deliverAlertEmail({
      from: DEFAULT_ALERT_FROM,
      to: ALERT_TO,
      cc: ALERT_CC,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });
    alertProvider = delivery.provider;
    if (delivery.ok) {
      alertDelivery = "sent";
      console.info(`QBO health alert email sent provider=${delivery.provider}`);
    } else {
      alertDelivery = "failed";
      alertDeliveryCode = delivery.code;
      console.error(`QBO_ALERT_DELIVERY_FAILED provider=${delivery.provider} code=${delivery.code}`);
      await recordSecurityEvent({ event: "alert_delivery_failed", detail: delivery.code });
    }
  } else {
    console.info("QBO health check: no alert email. No client is dead, urgent, or warning.");
  }

  return NextResponse.json(
    {
      ok: !storageFailed,
      checked_slugs: slugs,
      alerts_found: ordered.length,
      alerts: ordered.map((alert) => ({
        slug: alert.slug,
        status: alert.status,
        days_remaining: alert.daysRemaining,
        detail: alertJsonDetail(alert),
      })),
      connections,
      alert_delivery: alertDelivery,
      alert_provider: alertProvider,
      ...(alertDeliveryCode ? { alert_delivery_code: alertDeliveryCode } : {}),
    },
    { status: storageFailed ? 500 : 200, headers: { "Cache-Control": "no-store" } },
  );
}

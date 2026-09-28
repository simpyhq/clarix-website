// Daily QuickBooks health check. Emails when a client needs to reconnect
// or the refresh token expires within 14 days. Clients come from KV, not a
// hardcoded list. Requires CRON_SECRET.
//
// Alerts go to michael@ospipe.com and christian@clarixhq.ai, with the
// existing outlook address on cc.

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { listQboClientSlugs } from "@/lib/qbo-clients";
import { escapeHtml } from "@/lib/qbo-html";
import { qboConnectUrl } from "@/lib/qbo-oauth-state";
import { QboStorageError } from "@/lib/qbo-records";
import { cronAuthorized, publicRefreshError } from "@/lib/qbo-security";
import { getQboTokens } from "@/lib/qbo-token-helper";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALERT_TO = ["michael@ospipe.com", "christian@clarixhq.ai"];
const ALERT_CC = ["christian.simpson.2018@outlook.com"];
const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type Alert = { slug: string; reason: string; detail?: string; connectUrl: string };

export async function GET(request: NextRequest) {
  if (!cronAuthorized(request.headers.get("authorization"), process.env.CRON_SECRET)) {
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
  const alerts: Alert[] = [];
  let storageFailed = false;

  for (const slug of slugs) {
    try {
      const record = await getQboTokens(slug);
      if (!record) continue;
      const connectUrl = qboConnectUrl(slug);

      if (record.needs_reauth) {
        alerts.push({
          slug,
          reason: "needs_reauth",
          detail: publicRefreshError(record.last_refresh_error) || "Refresh token is invalid.",
          connectUrl,
        });
        continue;
      }

      if (record.refresh_token_expires_at && record.refresh_token_expires_at < now + FOURTEEN_DAYS_MS) {
        const daysUntil = Math.ceil((record.refresh_token_expires_at - now) / (24 * 60 * 60 * 1000));
        alerts.push({
          slug,
          reason: "refresh_token_expiring_soon",
          detail: `Refresh token expires in ${daysUntil} days.`,
          connectUrl,
        });
      }
    } catch (err) {
      if (err instanceof QboStorageError) storageFailed = true;
      console.error(`QBO health check error for ${slug}:`, err instanceof Error ? err.name : "error");
    }
  }

  if (alerts.length > 0) {
    const text = [
      `ClarixHQ QBO Health Check — ${new Date().toISOString()}`,
      "",
      `${alerts.length} client(s) need attention:`,
      "",
      ...alerts.map((alert) => `• ${alert.slug} (${alert.reason}): ${alert.detail || "No details"}\n  Reconnect: ${alert.connectUrl}`),
    ].join("\n");

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#0f172a;">
        <div style="background:#dc2626;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;color:#fff;font-size:18px;font-weight:600;">QBO Health Alert</h1>
          <p style="margin:4px 0 0;color:#fca5a5;font-size:13px;">${escapeHtml(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }))} CT</p>
        </div>
        <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:24px;">
          <p style="color:#334155;font-size:14px;margin:0 0 16px;">
            ${alerts.length} QBO connection(s) need attention:
          </p>
          ${alerts
            .map(
              (alert) => `
            <div style="margin-bottom:16px;padding:16px;border:1px solid #fca5a5;border-radius:6px;background:#fef2f2;">
              <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#991b1b;">${escapeHtml(alert.slug)}</p>
              <p style="margin:0 0 4px;font-size:12px;color:#7f1d1d;"><strong>Issue:</strong> ${escapeHtml(alert.reason)}</p>
              <p style="margin:0 0 8px;font-size:12px;color:#7f1d1d;"><strong>Detail:</strong> ${escapeHtml(alert.detail || "—")}</p>
              <a href="${escapeHtml(alert.connectUrl)}" style="display:inline-block;padding:8px 16px;background:#dc2626;color:#fff;text-decoration:none;border-radius:4px;font-size:13px;">Reconnect</a>
            </div>`,
            )
            .join("")}
        </div>
      </div>`;

    try {
      await transporter.sendMail({
        from: '"Clarix QBO Health" <support@clarixhq.ai>',
        to: ALERT_TO,
        cc: ALERT_CC,
        subject: `Clarix QBO Health Alert — ${alerts.length} client(s) need re-authorization`,
        text,
        html,
      });
      console.log("QBO health alert email sent");
    } catch (err) {
      console.error("QBO health: failed to send alert email", err instanceof Error ? err.name : "error");
    }
  } else {
    console.log("QBO health check: all clients OK — no alerts.");
  }

  return NextResponse.json(
    {
      ok: !storageFailed,
      checked_slugs: slugs,
      alerts_found: alerts.length,
      alerts: alerts.map((alert) => ({ slug: alert.slug, reason: alert.reason, detail: alert.detail })),
    },
    { status: storageFailed ? 500 : 200, headers: { "Cache-Control": "no-store" } },
  );
}

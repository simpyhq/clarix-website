// File: app/api/cron/qbo-health/route.ts
//
// Vercel Cron job: runs daily (00:00 UTC via vercel.json "0 0 0 * * *").
// Checks every known client:
//   1. If needs_reauth is true → send email with re-authorize link
//   2. If refresh_token expires within 14 days → send email with re-authorize link
//
// Uses the same nodemailer-based email infrastructure as app/api/intake/route.ts.

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getQboTokens } from "@/lib/qbo-token-helper";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const KNOWN_CLIENT_SLUGS = [
  "mikemills-buck",
  "tcre-capital-buck",
  "amtm-investments-buck",
];

function buildAuthorizeUrl(slug: string): string {
  const clientId = process.env.QBO_CLIENT_ID || "";
  const redirectUri = encodeURIComponent(process.env.QBO_REDIRECT_URI || "https://clarixhq.ai/qbo/callback");
  return `https://appcenter.intuit.com/connect/oauth2?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=com.intuit.quickbooks.accounting&state=${slug}`;
}

const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  // Verify cron secret if configured.
  const authHeader = request.headers.get("Authorization") || "";
  const expectedSecret = process.env.CRON_SECRET;
  if (expectedSecret) {
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (token !== expectedSecret) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const now = Date.now();
  const alerts: Array<{ slug: string; reason: string; detail?: string; authorizeUrl: string }> = [];

  for (const slug of KNOWN_CLIENT_SLUGS) {
    try {
      const record = await getQboTokens(slug);
      if (!record) {
        continue; // skip unconnected clients
      }

      const companyName = record.company_name || slug;
      const authorizeUrl = buildAuthorizeUrl(slug);

      // Check 1: needs_reauth
      if (record.needs_reauth) {
        alerts.push({
          slug,
          reason: "needs_reauth",
          detail: record.last_refresh_error || "Refresh token is invalid.",
          authorizeUrl,
        });
        continue;
      }

      // Check 2: refresh_token_expires_at within 14 days
      if (record.refresh_token_expires_at && record.refresh_token_expires_at < now + FOURTEEN_DAYS_MS) {
        const daysUntil = Math.ceil((record.refresh_token_expires_at - now) / (24 * 60 * 60 * 1000));
        alerts.push({
          slug,
          reason: "refresh_token_expiring_soon",
          detail: `Refresh token expires in ${daysUntil} days (${new Date(record.refresh_token_expires_at).toISOString()}).`,
          authorizeUrl,
        });
      }
    } catch (err) {
      console.error(`QBO health check error for ${slug}:`, err);
    }
  }

  // Send alert email if any issues found.
  if (alerts.length > 0) {
    const alertLines = alerts.map((a) =>
      `• ${a.slug} (${a.reason}): ${a.detail || "No details"}\n  Re-authorize: ${a.authorizeUrl}`
    );

    const text = `ClarixHQ QBO Health Check — ${new Date().toISOString()}\n\n${alerts.length} client(s) need attention:\n\n${alertLines.join("\n\n")}`;

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#0f172a;">
        <div style="background:#dc2626;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;color:#fff;font-size:18px;font-weight:600;">⚠️ QBO Health Alert</h1>
          <p style="margin:4px 0 0;color:#fca5a5;font-size:13px;">${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })} CT</p>
        </div>
        <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:24px;">
          <p style="color:#334155;font-size:14px;margin:0 0 16px;">
            ${alerts.length} QBO connection(s) need attention:
          </p>
          ${alerts.map((a) => `
            <div style="margin-bottom:16px;padding:16px;border:1px solid #fca5a5;border-radius:6px;background:#fef2f2;">
              <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#991b1b;">${a.slug}</p>
              <p style="margin:0 0 4px;font-size:12px;color:#7f1d1d;"><strong>Issue:</strong> ${a.reason}</p>
              <p style="margin:0 0 8px;font-size:12px;color:#7f1d1d;"><strong>Detail:</strong> ${a.detail || "—"}</p>
              <a href="${escapeHtml(a.authorizeUrl)}" style="display:inline-block;padding:8px 16px;background:#dc2626;color:#fff;text-decoration:none;border-radius:4px;font-size:13px;">Re-authorize Now</a>
            </div>
          `).join("")}
        </div>
        <p style="font-size:12px;color:#94a3b8;margin-top:12px;">ClarixHQ daily QBO health check — action required</p>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: '"Clarix QBO Health" <support@clarixhq.ai>',
        to: "michael@ospipe.com",
        cc: "christian.simpson.2018@outlook.com",
        subject: `Clarix QBO Health Alert — ${alerts.length} client(s) need re-authorization`,
        text,
        html,
      });
      console.log("QBO health alert email sent to michael@ospipe.com");
    } catch (emailErr) {
      console.error("QBO health: failed to send alert email:", emailErr);
    }
  } else {
    console.log("QBO health check: all clients OK — no alerts.");
  }

  return NextResponse.json({
    ok: true,
    checked_slugs: KNOWN_CLIENT_SLUGS,
    alerts_found: alerts.length,
    alerts: alerts.map((a) => ({ slug: a.slug, reason: a.reason, detail: a.detail })),
  });
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
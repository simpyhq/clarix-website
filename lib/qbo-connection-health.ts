// Classifies a stored QuickBooks connection for the daily health check.
// Missing refresh-token expiry is "unknown", not a failure: records written
// before that field existed stay readable, and the next successful refresh
// fills it in.

import { escapeHtml } from "@/lib/qbo-html";

const DAY_MS = 24 * 60 * 60 * 1000;
export const REFRESH_URGENT_WINDOW_MS = 7 * DAY_MS;
export const REFRESH_WARNING_WINDOW_MS = 14 * DAY_MS;

export type ConnectionHealthStatus = "healthy" | "warning" | "urgent" | "dead" | "unknown";

export type ConnectionHealth = {
  status: ConnectionHealthStatus;
  daysRemaining: number | null;
};

export type HealthAlertStatus = "dead" | "urgent" | "warning";

export type HealthAlert = {
  slug: string;
  status: HealthAlertStatus;
  daysRemaining: number | null;
  detail: string;
  connectUrl: string;
};

function finiteExpiry(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function daysUntil(expiresAt: number, now: number): number {
  const days = Math.ceil((expiresAt - now) / DAY_MS);
  // Math.ceil of a fraction just under zero is -0. Show that as 0.
  return days === 0 ? 0 : days;
}

export function classifyRefreshExpiry(
  record: { needs_reauth?: boolean; refresh_token_expires_at?: number | null },
  now: number,
): ConnectionHealth {
  const expiresAt = record.refresh_token_expires_at;
  const daysRemaining = finiteExpiry(expiresAt) ? daysUntil(expiresAt, now) : null;

  if (record.needs_reauth) {
    return { status: "dead", daysRemaining };
  }
  if (!finiteExpiry(expiresAt)) {
    return { status: "unknown", daysRemaining: null };
  }
  if (expiresAt <= now) return { status: "dead", daysRemaining };
  if (expiresAt <= now + REFRESH_URGENT_WINDOW_MS) return { status: "urgent", daysRemaining };
  if (expiresAt <= now + REFRESH_WARNING_WINDOW_MS) return { status: "warning", daysRemaining };
  return { status: "healthy", daysRemaining };
}

export function formatDaysRemaining(days: number | null): string {
  if (days === null) return "unknown";
  return String(days);
}

function alertDetail(alert: HealthAlert): string {
  if (alert.status === "urgent") return "Refresh token expires within 7 days.";
  if (alert.status === "warning") return "Refresh token expires within 14 days.";
  return alert.detail;
}

const SEVERITY: Record<HealthAlertStatus, number> = { dead: 0, urgent: 1, warning: 2 };

export function sortHealthAlerts(alerts: HealthAlert[]): HealthAlert[] {
  return [...alerts].sort(
    (a, b) => SEVERITY[a.status] - SEVERITY[b.status] || a.slug.localeCompare(b.slug),
  );
}

export function buildHealthAlertContent(alerts: HealthAlert[], sentAt = new Date()): {
  subject: string;
  text: string;
  html: string;
} {
  const ordered = sortHealthAlerts(alerts);
  const stamp = sentAt.toISOString();
  const subject = `Clarix QBO Health Alert — ${ordered.length} client(s) need attention`;
  const lines = ordered.map((alert) =>
    [
      `• ${alert.slug}`,
      `  status: ${alert.status}`,
      `  days remaining: ${formatDaysRemaining(alert.daysRemaining)}`,
      `  detail: ${alertDetail(alert)}`,
      `  reconnect: ${alert.connectUrl}`,
    ].join("\n"),
  );
  const text = [
    `ClarixHQ QBO Health Check — ${stamp}`,
    "",
    `${ordered.length} client(s) need attention:`,
    "",
    ...lines,
  ].join("\n");

  const html = `<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#0f172a;">
<div style="background:#dc2626;padding:20px 24px;border-radius:8px 8px 0 0;">
<h1 style="margin:0;color:#fff;font-size:18px;font-weight:600;">QBO Health Alert</h1>
<p style="margin:4px 0 0;color:#fca5a5;font-size:13px;">${escapeHtml(sentAt.toLocaleString("en-US", { timeZone: "America/Chicago" }))} CT</p>
</div>
<div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:24px;">
<p style="color:#334155;font-size:14px;margin:0 0 16px;">${ordered.length} QBO connection(s) need attention. Each reconnect link opens the existing connect flow.</p>
${ordered
  .map((alert) => {
    const warning = alert.status === "warning";
    const border = warning ? "#fcd34d" : "#fca5a5";
    const background = warning ? "#fffbeb" : "#fef2f2";
    const title = warning ? "#92400e" : "#991b1b";
    return `<div style="margin-bottom:16px;padding:16px;border:1px solid ${border};border-radius:6px;background:${background};">
<p style="margin:0 0 4px;font-size:14px;font-weight:600;color:${title};">${escapeHtml(alert.slug)}</p>
<p style="margin:0 0 4px;font-size:12px;color:${title};"><strong>Status:</strong> ${escapeHtml(alert.status)}</p>
<p style="margin:0 0 4px;font-size:12px;color:${title};"><strong>Days remaining:</strong> ${escapeHtml(formatDaysRemaining(alert.daysRemaining))}</p>
<p style="margin:0 0 8px;font-size:12px;color:${title};"><strong>Detail:</strong> ${escapeHtml(alertDetail(alert))}</p>
<a href="${escapeHtml(alert.connectUrl)}" style="display:inline-block;padding:8px 16px;background:#dc2626;color:#fff;text-decoration:none;border-radius:4px;font-size:13px;">Reconnect</a>
</div>`;
  })
  .join("")}
</div>
</div>`;

  return { subject, text, html };
}

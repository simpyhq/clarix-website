// Security trail. One JSON object per event, in the process log and in a
// capped KV list (qbo:audit). The payload is slugs, coarse reasons, and an
// IP. It never includes tokens, API keys, OAuth codes, or request URLs.

import { getQboKv } from "@/lib/qbo-kv";
import { QBO_AUDIT_KEY } from "@/lib/qbo-keys";
import { isValidClientSlug } from "@/lib/qbo-security";

const MAX_EVENTS = 500;

const EVENTS = new Set([
  "connect",
  "reconnect_refused",
  "key_issued",
  "key_rotated",
  "auth_failure",
  "refresh_failure",
  "rate_limited",
]);

export type SecurityEventName =
  | "connect"
  | "reconnect_refused"
  | "key_issued"
  | "key_rotated"
  | "auth_failure"
  | "refresh_failure"
  | "rate_limited";

export type SecurityEvent = {
  event: SecurityEventName;
  slug?: string | null;
  ip?: string | null;
  detail?: string | null;
};

export type StoredSecurityEvent = {
  ts: string;
  event: SecurityEventName;
  slug?: string;
  ip?: string;
  detail?: string;
};

function safeDetail(detail: string | null | undefined): string | undefined {
  if (!detail) return undefined;
  const trimmed = detail.trim();
  if (!/^[A-Za-z0-9_:-]{1,80}$/.test(trimmed)) return undefined;
  return trimmed;
}

function safeIp(ip: string | null | undefined): string | undefined {
  if (!ip) return undefined;
  const trimmed = ip.trim().slice(0, 64);
  if (!/^[a-zA-Z0-9_.:-]+$/.test(trimmed)) return undefined;
  return trimmed;
}

export function sanitizeSecurityEvent(event: SecurityEvent, now = Date.now()): StoredSecurityEvent {
  if (!EVENTS.has(event.event)) {
    return { ts: new Date(now).toISOString(), event: "auth_failure", detail: "unknown_event" };
  }
  const stored: StoredSecurityEvent = {
    ts: new Date(now).toISOString(),
    event: event.event,
  };
  if (event.slug && isValidClientSlug(event.slug)) stored.slug = event.slug;
  const ip = safeIp(event.ip);
  if (ip) stored.ip = ip;
  const detail = safeDetail(event.detail);
  if (detail) stored.detail = detail;
  return stored;
}

export async function recordSecurityEvent(event: SecurityEvent): Promise<void> {
  const stored = sanitizeSecurityEvent(event);
  console.info("QBO audit", JSON.stringify(stored));
  try {
    await getQboKv().appendLog(QBO_AUDIT_KEY, JSON.stringify(stored), MAX_EVENTS);
  } catch (err) {
    console.error("QBO audit store failed", err instanceof Error ? err.name : "error");
  }
}

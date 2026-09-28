// Fixed-window counters in KV. Limits are deliberately high for the token
// API so a Mac mini's normal polling cannot trip them. A counter that cannot
// be written fails open: a limiter outage must not lock a live client out.
// Unauthenticated calls do not consume a slug's budget.

import { getQboKv } from "@/lib/qbo-kv";
import { qboNow } from "@/lib/qbo-runtime";

export const RATE_WINDOW_SECONDS = 600;

export const RATE_LIMITS = {
  tokenIp: { name: "qbo-token-ip", limit: 2400, windowSeconds: RATE_WINDOW_SECONDS },
  tokenSlug: { name: "qbo-token-slug", limit: 1200, windowSeconds: RATE_WINDOW_SECONDS },
  tokenAuthFail: { name: "qbo-token-authfail", limit: 120, windowSeconds: RATE_WINDOW_SECONDS },
  connectIp: { name: "qbo-connect-ip", limit: 30, windowSeconds: RATE_WINDOW_SECONDS },
  callbackIp: { name: "qbo-callback-ip", limit: 60, windowSeconds: RATE_WINDOW_SECONDS },
  intakeIp: { name: "qbo-intake-ip", limit: 10, windowSeconds: RATE_WINDOW_SECONDS },
  adminIp: { name: "qbo-client-key-ip", limit: 30, windowSeconds: RATE_WINDOW_SECONDS },
  debugIp: { name: "qbo-debug-ip", limit: 120, windowSeconds: RATE_WINDOW_SECONDS },
  debugSlug: { name: "qbo-debug-slug", limit: 120, windowSeconds: RATE_WINDOW_SECONDS },
} as const;

export type RateLimitName = (typeof RATE_LIMITS)[keyof typeof RATE_LIMITS]["name"];

const testOverrides = new Map<string, number>();

export function setRateLimitTestOverride(name: string, limit: number | null): void {
  if (process.env.NODE_ENV === "production") {
    throw new Error("rate limit test override cannot be used in production");
  }
  if (limit === null) testOverrides.delete(name);
  else testOverrides.set(name, limit);
}

export function clearRateLimitTestOverrides(): void {
  if (process.env.NODE_ENV === "production") {
    throw new Error("rate limit test override cannot be used in production");
  }
  testOverrides.clear();
}

export function clientIp(headers: { get(name: string): string | null }): string {
  const real = headers.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 64);
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((part) => part.trim()).filter(Boolean);
    const last = parts[parts.length - 1];
    if (last) return last.slice(0, 64);
  }
  return "unknown";
}

function safeId(id: string): string {
  const cleaned = id.replace(/[^a-zA-Z0-9_.:-]/g, "_").slice(0, 80);
  return cleaned || "unknown";
}

export async function consumeRateLimit(spec: {
  name: string;
  id: string;
  limit: number;
  windowSeconds: number;
}): Promise<{ ok: boolean; retryAfterSeconds: number }> {
  const limit = testOverrides.get(spec.name) ?? spec.limit;
  const window = Math.floor(qboNow() / 1000 / spec.windowSeconds);
  const key = `qbo:rl:${spec.name}:${safeId(spec.id)}:${window}`;
  try {
    const count = await getQboKv().incr(key, spec.windowSeconds);
    if (count > limit) return { ok: false, retryAfterSeconds: spec.windowSeconds };
    return { ok: true, retryAfterSeconds: 0 };
  } catch (err) {
    console.warn("QBO rate limit skipped", spec.name, err instanceof Error ? err.name : "error");
    return { ok: true, retryAfterSeconds: 0 };
  }
}

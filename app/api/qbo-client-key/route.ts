// Issues or rotates a per-client token API key. Disabled (404) until
// QBO_KEY_ADMIN_SECRET is set. The plaintext key is returned once and only
// its hash is stored.
//
//   POST /api/qbo-client-key
//   Authorization: Bearer <QBO_KEY_ADMIN_SECRET>
//   {"slug":"mikemills-buck","rotate":false}

import { NextRequest, NextResponse } from "next/server";
import { recordSecurityEvent } from "@/lib/qbo-audit";
import { issueClientApiKey } from "@/lib/qbo-client-keys";
import { clientIp, consumeRateLimit, RATE_LIMITS } from "@/lib/qbo-rate-limit";
import { safeEqual } from "@/lib/qbo-security";

export const runtime = "nodejs";
export const maxDuration = 60;

const JSON_HEADERS = { "Cache-Control": "no-store" };

function json(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: JSON_HEADERS });
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request.headers);
  const limit = await consumeRateLimit({ ...RATE_LIMITS.adminIp, id: ip });
  if (!limit.ok) {
    await recordSecurityEvent({ event: "rate_limited", ip, detail: "qbo-client-key" });
    return json({ error: true, reason: "rate_limited" }, 429);
  }

  const adminSecret = process.env.QBO_KEY_ADMIN_SECRET;
  if (!adminSecret) return json({ error: true }, 404);

  const header = request.headers.get("authorization") || "";
  const match = /^Bearer\s+(\S+)\s*$/i.exec(header);
  if (!match || !safeEqual(match[1], adminSecret)) {
    await recordSecurityEvent({ event: "auth_failure", ip, detail: "qbo-client-key" });
    return json({ error: true }, 401);
  }

  let body: { slug?: unknown; rotate?: unknown };
  try {
    body = (await request.json()) as { slug?: unknown; rotate?: unknown };
  } catch {
    return json({ error: true, reason: "invalid_body" }, 400);
  }
  if (typeof body.slug !== "string") return json({ error: true, reason: "invalid_body" }, 400);

  const result = await issueClientApiKey(body.slug, { rotate: body.rotate === true });
  if (!result.ok) {
    const status = result.reason === "key_exists" ? 409 : result.reason === "storage_error" ? 503 : 400;
    return json({ error: true, reason: result.reason }, status);
  }

  console.log(`QBO client key ${result.rotated ? "rotated" : "issued"} for ${result.slug} prefix ${result.prefix}`);
  return json({
    slug: result.slug,
    apiKey: result.apiKey,
    prefix: result.prefix,
    rotated: result.rotated,
    previous_valid_until: result.previousValidUntil,
  });
}

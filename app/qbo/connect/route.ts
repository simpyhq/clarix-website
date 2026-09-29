// Starts a QuickBooks connect or reconnect. Mints a signed, expiring,
// single-use state value and redirects to Intuit. Email links point here
// rather than embedding a raw slug as OAuth state.

import { NextRequest, NextResponse } from "next/server";
import { recordSecurityEvent } from "@/lib/qbo-audit";
import { HTML_PAGE_HEADERS, renderConnectionPage } from "@/lib/qbo-html";
import { createOAuthState, intuitAuthorizeUrl } from "@/lib/qbo-oauth-state";
import { clientIp, consumeRateLimit, RATE_LIMITS } from "@/lib/qbo-rate-limit";
import { QboStorageError } from "@/lib/qbo-records";
import { isValidClientSlug } from "@/lib/qbo-security";

export const runtime = "nodejs";
export const maxDuration = 60;

function page(message: string, status: number): NextResponse {
  return new NextResponse(renderConnectionPage({ success: false, message }), {
    status,
    headers: HTML_PAGE_HEADERS,
  });
}

export async function GET(request: NextRequest) {
  const client = request.nextUrl.searchParams.get("client") || "";
  const ip = clientIp(request.headers);
  const limit = await consumeRateLimit({ ...RATE_LIMITS.connectIp, id: ip });
  if (!limit.ok) {
    await recordSecurityEvent({ event: "rate_limited", slug: client, ip, detail: "qbo-connect" });
    return page("Too many connection attempts. Wait a few minutes and try again.", 429);
  }
  if (!isValidClientSlug(client)) {
    return page("This connect link is not valid. Contact support.", 400);
  }

  try {
    // Fail before writing a nonce if the Intuit app is not configured.
    intuitAuthorizeUrl("preflight");
  } catch (err) {
    console.error("QBO connect: authorize URL not configured", err instanceof Error ? err.name : "error");
    return page("QuickBooks connection is not configured. Contact support.", 500);
  }

  let state: string;
  try {
    state = await createOAuthState(client);
  } catch (err) {
    if (err instanceof QboStorageError) {
      console.error("QBO connect: could not store state", err.name);
      return page("We couldn't start the QuickBooks connection. Please try again or contact support.", 500);
    }
    console.error("QBO connect: not configured", err instanceof Error ? err.name : "error");
    return page("QuickBooks connection is not configured. Contact support.", 500);
  }

  const authorizeUrl = intuitAuthorizeUrl(state);

  const response = NextResponse.redirect(authorizeUrl, 302);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

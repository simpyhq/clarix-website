// Starts a QuickBooks connect or reconnect. Mints a signed, expiring,
// single-use state value and redirects to Intuit. Email links point here
// rather than embedding a raw slug as OAuth state.

import { NextRequest, NextResponse } from "next/server";
import { HTML_PAGE_HEADERS, renderConnectionPage } from "@/lib/qbo-html";
import { createOAuthState, intuitAuthorizeUrl } from "@/lib/qbo-oauth-state";
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

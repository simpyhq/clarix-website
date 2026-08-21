// File: app/api/qbo-token/route.ts
// (Next.js App Router API route)
//
// Lightweight, secret-gated HTTP endpoint that lets an external client agent
// (e.g. "Buck" — no access to this codebase, KV store, or a Node runtime)
// fetch a ready-to-use QBO access token over plain HTTPS, without needing
// any of the internal OAuth/refresh implementation details.
//
// This route is a PURE ADDITION: it only ever *reads* from the existing
// getValidAccessToken() helper. It does not touch the OAuth callback flow,
// the connect/authorize URL flow, or KV writes of any kind. Nothing here can
// affect an existing, already-connected client (e.g. Mills Wealth Advisors /
// "mikemills-buck") — worst case on a bug in this file is a failed GET to
// this one new route.
//
// Required environment variables:
//   QBO_TOKEN_API_SECRET   (new — long random shared secret)
//   (everything else — QBO_CLIENT_ID, QBO_CLIENT_SECRET, QBO_REDIRECT_URI,
//    KV_REST_API_URL, KV_REST_API_TOKEN — already exist, unchanged, and are
//    consumed indirectly via the helper, not by this file directly.)
//
// Usage:
//   GET /api/qbo-token?client=<slug>&secret=<QBO_TOKEN_API_SECRET>
//
// Response shapes:
//   200 { accessToken, realmId, expiresInSeconds? }   — success
//   200 { error: true, reason: "<reason>" }            — legitimate business
//                                                         state, e.g. client
//                                                         hasn't connected yet
//                                                         or needs to reauth
//   401 { error: true }                                 — bad/missing secret,
//                                                         no further detail

import { NextRequest, NextResponse } from "next/server";
import { getValidAccessToken } from "@/lib/qbo-token-helper";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const client = searchParams.get("client");
  const secret = searchParams.get("secret");

  const expectedSecret = process.env.QBO_TOKEN_API_SECRET;

  // Fail closed: if the env var itself isn't set, treat every request as
  // unauthorized rather than accidentally allowing an empty-string match.
  if (!expectedSecret || !secret || secret !== expectedSecret) {
    // Generic 401 — no details on whether it was a missing param, wrong
    // secret, missing client, etc. Never leak which part of the request
    // was wrong; that would help an attacker narrow down valid inputs.
    return NextResponse.json({ error: true }, { status: 401 });
  }

  if (!client) {
    // Secret was valid but no client slug was given — still a client-side
    // input error, not an auth failure. Distinguish it from the 401 above
    // since the caller already proved they hold the shared secret.
    return NextResponse.json({ error: true, reason: "missing_client" });
  }

  const result = await getValidAccessToken(client);

  if (!result.ok) {
    // DESIGN NOTE: we intentionally return HTTP 200 here, not 401/404/500.
    // "Not connected yet" or "needs reauth" are normal, expected business
    // states for a client agent to encounter (e.g. Buck polling before the
    // human has clicked through the QBO authorize link) — not a failure of
    // this API itself. Reserving non-200 codes for actual auth/transport
    // failures (bad secret, network errors) keeps the contract simple for
    // external callers: "200 + error:true" always means "check `reason`
    // and handle it as a known state", while non-200 always means
    // "something is wrong with how you're calling this endpoint."
    return NextResponse.json({ error: true, reason: result.reason });
  }

  // Never log the access token itself — only the client slug, matching the
  // "never log actual token values" convention used throughout the helper.
  console.log("QBO token API: served token for client:", client);

  return NextResponse.json({
    accessToken: result.accessToken,
    realmId: result.realmId,
  });
}
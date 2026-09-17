// File: app/api/qbo-token/route.ts
// (Next.js App Router API route)
//
// Lightweight, secret-gated HTTP endpoint that lets an external client agent
// (e.g. "Buck" — no access to this codebase, KV store, or a Node runtime)
// fetch a ready-to-use QBO access token over plain HTTPS, without needing
// any of the internal OAuth/refresh implementation details.
//
// Required environment variables:
//   QBO_TOKEN_API_SECRET   (long random shared secret)
//
// Usage:
//   GET /api/qbo-token?client=<slug>&secret=<QBO_TOKEN_API_SECRET>
//
// Response shapes:
//   200 { accessToken, realmId }              — success
//   200 { error: true, reason, detail? }      — known state (not connected, needs reauth)
//   401 { error: true }                       — bad/missing secret

import { NextRequest, NextResponse } from "next/server";
import { getValidAccessToken } from "@/lib/qbo-token-helper";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const client = searchParams.get("client");
  const secret = searchParams.get("secret");

  const expectedSecret = process.env.QBO_TOKEN_API_SECRET;

  if (!expectedSecret || !secret || secret !== expectedSecret) {
    return NextResponse.json({ error: true }, { status: 401 });
  }

  if (!client) {
    return NextResponse.json({ error: true, reason: "missing_client" });
  }

  const result = await getValidAccessToken(client);

  if (!result.ok) {
    return NextResponse.json({ error: true, reason: result.reason, detail: result.detail });
  }

  console.log("QBO token API: served token for client:", client);

  return NextResponse.json({
    accessToken: result.accessToken,
    realmId: result.realmId,
  });
}
// File: app/qbo/callback/route.ts
// (Next.js App Router API route — adjust path if using Pages Router, see note at bottom)
//
// Handles the QuickBooks Online OAuth2 redirect from Intuit.
// Exchanges the authorization `code` for access + refresh tokens.
//
// Required environment variables (set in Vercel project settings):
//   QBO_CLIENT_ID
//   QBO_CLIENT_SECRET
//   QBO_REDIRECT_URI   = https://clarixhq.ai/qbo/callback (or www. version, whichever is canonical)
//
// Where tokens go: this stub logs them and returns a success page.
// Hank will wire up real storage (KV, DB, or webhook forward) once this
// route is live and reachable — no additional Vercel-side changes needed
// for that follow-up step.

import { NextRequest, NextResponse } from "next/server";

const KV_REST_URL = process.env.KV_REST_API_URL || "";
const KV_REST_TOKEN = process.env.KV_REST_API_TOKEN || "";

async function kvSet(key: string, value: unknown): Promise<void> {
  const url = `${KV_REST_URL}/set/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(JSON.stringify(value)),
  });
  if (!res.ok) throw new Error(`KV SET failed: ${res.status}`);
}

const INTUIT_TOKEN_URL = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  const realmId = searchParams.get("realmId");
  const state = searchParams.get("state"); // customer identifier, if provided
  const error = searchParams.get("error");

  if (error) {
    return htmlResponse(`Connection cancelled or denied: ${error}`, 400);
  }

  if (!code || !realmId) {
    return htmlResponse("Missing required parameters (code/realmId).", 400);
  }

  const clientId = process.env.QBO_CLIENT_ID!;
  const clientSecret = process.env.QBO_CLIENT_SECRET!;
  const redirectUri = process.env.QBO_REDIRECT_URI!;

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const tokenResp = await fetch(INTUIT_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenResp.ok) {
    const errText = await tokenResp.text();
    console.error("QBO token exchange failed:", tokenResp.status, errText);
    return htmlResponse(
      "We couldn't complete the connection. Please try again or contact support.",
      502
    );
  }

  const tokens = await tokenResp.json();
  // tokens: { access_token, refresh_token, token_type, expires_in, x_refresh_token_expires_in }

  console.log("QBO connected:", {
    customer: state || "unknown",
    realmId,
    connected_at: new Date().toISOString(),
    // never log actual token values
  });

  // Persist tokens to KV so /api/qbo-token can serve live access tokens.
  // Key schema: "qbo:<clientSlug>" — clientSlug comes from the `state` param
  // passed through the OAuth flow (set at connect time).
  const clientSlug = state || realmId; // fall back to realmId if state wasn't set
  const expiresAt = Date.now() + (tokens.expires_in ?? 3600) * 1000;

  const tokenRecord = {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    realmId,
    expiresAt,
  };

  try {
    await kvSet(`qbo:${clientSlug}`, tokenRecord);
    console.log("QBO token persisted to KV for client:", clientSlug);
  } catch (kvErr) {
    console.error("QBO callback: failed to write token to KV:", kvErr);
    // Still show success to user — they connected. Log alert for debugging.
  }

  return htmlResponse("QuickBooks connected successfully. You can close this window.", 200, true);
}

function htmlResponse(message: string, status: number, success = false) {
  const color = success ? "#16a34a" : "#dc2626";
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>ClarixHQ · QuickBooks Connection</title>
<style>
  body { font-family: -apple-system, sans-serif; background:#0a0a0a; color:#eee;
         display:flex; align-items:center; justify-content:center; height:100vh; margin:0; }
  .card { text-align:center; max-width:420px; padding:2rem; }
  h1 { color:${color}; font-size:1.25rem; margin-bottom:0.5rem; }
  p { color:#999; font-size:0.9rem; }
</style>
</head>
<body>
  <div class="card">
    <h1>${success ? "✓ Connected" : "Connection Issue"}</h1>
    <p>${escapeHtml(message)}</p>
  </div>
</body>
</html>`;
  return new NextResponse(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/*
 * PAGES ROUTER VERSION (only needed if the site uses /pages instead of /app):
 * File would be: pages/api/qbo/callback.ts
 * Note: route would resolve to /api/qbo/callback, not /qbo/callback —
 * the redirect URI registered in Intuit would need to match whichever
 * path is actually used. Confirm with Hank which router the app uses
 * before implementing.
 */

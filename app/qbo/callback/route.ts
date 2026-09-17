// File: app/qbo/callback/route.ts
// (Next.js App Router API route)
//
// Handles the QuickBooks Online OAuth2 redirect from Intuit.
// Exchanges the authorization `code` for access + refresh tokens,
// fetches CompanyInfo to record the company name, guards against realm
// collisions, and renders a dynamic success page.
//
// Required environment variables:
//   QBO_CLIENT_ID
//   QBO_CLIENT_SECRET
//   QBO_REDIRECT_URI   = https://clarixhq.ai/qbo/callback (or www. version, whichever is canonical)

import { NextRequest, NextResponse } from "next/server";
import { getQboTokens, saveQboTokens, QboTokenRecord } from "@/lib/qbo-token-helper";

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
    body: JSON.stringify(value),
  });
  if (!res.ok) throw new Error(`KV SET failed: ${res.status}`);
}

async function kvGetAllKeys(pattern: string): Promise<string[]> {
  // Upstash REST API: GET /keys/<pattern> returns { result: ["key1","key2",...] }
  const url = `${KV_REST_URL}/keys/${encodeURIComponent(pattern)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${KV_REST_TOKEN}` },
  });
  if (!res.ok) return [];
  const body = await res.json();
  return Array.isArray(body.result) ? body.result : [];
}

async function kvGetRaw(key: string): Promise<unknown> {
  const url = `${KV_REST_URL}/get/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${KV_REST_TOKEN}` },
  });
  if (!res.ok) return null;
  const body = await res.json();
  if (body.result === null || body.result === undefined) return null;
  let parsed: unknown = body.result;
  for (let i = 0; i < 3 && typeof parsed === "string"; i++) {
    parsed = JSON.parse(parsed);
  }
  return parsed;
}

const INTUIT_TOKEN_URL = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  const realmId = searchParams.get("realmId");
  const state = searchParams.get("state"); // customer identifier (client slug)
  const error = searchParams.get("error");

  if (error) {
    return htmlResponse(`Connection cancelled or denied: ${error}`, 400);
  }

  if (!code || !realmId) {
    return htmlResponse("Missing required parameters (code/realmId).", 400);
  }

  const clientSlug = state || realmId; // fall back to realmId if state wasn't set
  const clientId = process.env.QBO_CLIENT_ID!;
  const clientSecret = process.env.QBO_CLIENT_SECRET!;
  const redirectUri = process.env.QBO_REDIRECT_URI!;

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  // --- Realm collision guard ---
  // Before exchanging the code, check if this realmId already belongs to a
  // DIFFERENT slug's record. If so, refuse to write — the user selected the
  // wrong company at the Intuit picker.
  try {
    const allQboClientKeys = await kvGetAllKeys("qbo:client:*");
    for (const key of allQboClientKeys) {
      if (key === `qbo:client:${clientSlug}`) continue; // skip self
      const existingRecord = (await kvGetRaw(key)) as Record<string, unknown> | null;
      if (existingRecord?.realmId === realmId) {
        const otherSlug = key.replace("qbo:client:", "");
        return htmlResponse(
          `This QuickBooks company (realmId ${realmId}) is already connected to client "${otherSlug}". ` +
          "Please go back to the Intuit company picker and select the correct QuickBooks company for your account. " +
          "If you need assistance, contact support.",
          409
        );
      }
    }
  } catch (kvErr) {
    // Non-critical: if KV scanning fails, proceed anyway; the collision
    // guard is a defense-in-depth measure, not a hard prerequisite.
    console.error("QBO callback: realm collision scan failed (proceeding):", kvErr);
  }

  // --- Exchange authorization code for tokens ---
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
  });

  // --- Fetch CompanyInfo ---
  let companyName = "Unknown Company";
  try {
    const companyResp = await fetch(
      `https://quickbooks.api.intuit.com/v3/company/${realmId}/companyinfo/${realmId}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          Accept: "application/json",
        },
      }
    );
    if (companyResp.ok) {
      const companyData = await companyResp.json();
      companyName = companyData?.CompanyInfo?.CompanyName || companyData?.CompanyName || "Unknown Company";
      console.log("QBO CompanyInfo fetched:", companyName);
    } else {
      console.warn("QBO CompanyInfo fetch failed:", companyResp.status);
    }
  } catch (ciErr) {
    console.error("QBO CompanyInfo fetch error (non-fatal):", ciErr);
  }

  // --- Persist tokens to KV ---
  const now = Date.now();
  const expiresAt = now + (tokens.expires_in ?? 3600) * 1000;
  const refreshTokenExpiresAt =
    now + (tokens.x_refresh_token_expires_in ?? 100 * 24 * 3600) * 1000;

  const tokenRecord: QboTokenRecord = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    realmId,
    company_name: companyName,
    expires_at: expiresAt,
    refresh_token_expires_at: refreshTokenExpiresAt,
    connected_at: new Date(now).toISOString(),
    updated_at: new Date(now).toISOString(),
    needs_reauth: false,
  };

  let kvConfirmed = false;
  try {
    await saveQboTokens(clientSlug, tokenRecord);
    console.log("QBO token persisted to KV for client:", clientSlug);
    kvConfirmed = true;
  } catch (kvErr) {
    console.error("QBO callback: failed to write token to KV:", kvErr);
  }

  // Render the result page — only show "Connected" if KV write succeeded.
  if (kvConfirmed) {
    return htmlResponse(
      `QuickBooks connected successfully for <strong>${escapeHtml(companyName)}</strong> (${escapeHtml(clientSlug)}). You can close this window.`,
      200,
      true
    );
  }

  return htmlResponse(
    "The connection was established but we encountered a storage error. <br/>" +
    "Your QuickBooks data is safe — please contact support to confirm your tokens were saved.",
    200,
    false
  );
}

function htmlResponse(message: string, status: number, success = false) {
  const color = success ? "#16a34a" : "#dc2626";
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>ClarixHQ · QuickBooks Connection</title>
<style>
  body { font-family: -apple-system, sans-serif; background:#0a0a0a; color:#eee;
         display:flex; align-items:center; justify-content:center; height:100vh; margin:0; }
  .card { text-align:center; max-width:480px; padding:2rem; }
  h1 { color:${color}; font-size:1.25rem; margin-bottom:0.5rem; }
  p { color:#999; font-size:0.9rem; line-height:1.5; }
</style>
</head>
<body>
  <div class="card">
    <h1>${success ? "✓ Connected" : "Connection Issue"}</h1>
    <p>${message}</p>
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
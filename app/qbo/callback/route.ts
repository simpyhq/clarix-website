// QuickBooks Online OAuth redirect. Exchanges the authorization code only
// after a signed, unexpired, single-use state value checks out. A missing or
// invalid state is rejected. realmId is never used as the client slug.
//
// An existing slug is not re-pointed at a different QuickBooks company.

import { NextRequest, NextResponse } from "next/server";
import { HTML_PAGE_HEADERS, renderConnectionPage } from "@/lib/qbo-html";
import { listQboClientSlugs } from "@/lib/qbo-clients";
import { consumeOAuthState } from "@/lib/qbo-oauth-state";
import { QboStorageError, QboTokenRecord } from "@/lib/qbo-records";
import {
  callbackClientSlug,
  INVALID_STATE_MESSAGE,
  isPlausibleAuthCode,
  isPlausibleRealmId,
  oauthDenialMessage,
  realmReconnectDecision,
  REALM_COLLISION_MESSAGE,
  REBIND_REFUSAL_MESSAGE,
} from "@/lib/qbo-security";
import { getQboTokens, intuitFetch, saveQboTokens } from "@/lib/qbo-token-helper";

export const runtime = "nodejs";
export const maxDuration = 60;

const INTUIT_TOKEN_URL = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";

function page(message: string, status: number, success = false): NextResponse {
  return new NextResponse(renderConnectionPage({ success, message }), {
    status,
    headers: HTML_PAGE_HEADERS,
  });
}

async function realmOwnedByOtherClient(slug: string, realmId: string): Promise<boolean> {
  const slugs = await listQboClientSlugs();
  for (const other of slugs) {
    if (other === slug) continue;
    const record = await getQboTokens(other);
    if (record?.realmId === realmId) {
      console.error(`QBO callback refused colliding company for slug "${slug}"`);
      return true;
    }
  }
  return false;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const realmId = searchParams.get("realmId");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return page(oauthDenialMessage(error), 400);
  }
  if (!code || !realmId || !isPlausibleAuthCode(code) || !isPlausibleRealmId(realmId)) {
    return page("Missing required parameters.", 400);
  }
  if (!state) {
    return page(INVALID_STATE_MESSAGE, 400);
  }

  let clientSlug: string | null;
  try {
    clientSlug = callbackClientSlug(await consumeOAuthState(state), realmId);
  } catch (err) {
    if (err instanceof QboStorageError) {
      console.error("QBO callback: state store failed", err.name);
      return page("We couldn't start the QuickBooks connection. Please try again or contact support.", 500);
    }
    throw err;
  }
  if (!clientSlug) return page(INVALID_STATE_MESSAGE, 400);

  let existing: QboTokenRecord | null;
  try {
    existing = await getQboTokens(clientSlug);
    const decision = realmReconnectDecision(existing?.realmId, realmId);
    if (decision === "refuse_rebind") {
      console.error(`QBO callback refused realm rebind for slug "${clientSlug}"`);
      return page(REBIND_REFUSAL_MESSAGE, 409);
    }
    if (await realmOwnedByOtherClient(clientSlug, realmId)) {
      return page(REALM_COLLISION_MESSAGE, 409);
    }
  } catch (err) {
    if (err instanceof QboStorageError || (err instanceof Error && err.name === "QboCorruptRecordError")) {
      console.error("QBO callback: could not read existing connections", err.name);
      return page("We couldn't start the QuickBooks connection. Please try again or contact support.", 500);
    }
    throw err;
  }

  const clientId = process.env.QBO_CLIENT_ID || "";
  const clientSecret = process.env.QBO_CLIENT_SECRET || "";
  const redirectUri = process.env.QBO_REDIRECT_URI || "";
  if (!clientId || !clientSecret || !redirectUri) {
    return page("QuickBooks connection is not configured. Contact support.", 500);
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  let tokenResp: Response;
  try {
    tokenResp = await intuitFetch(INTUIT_TOKEN_URL, {
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
  } catch (err) {
    console.error("QBO token exchange failed", err instanceof Error ? err.name : "error");
    return page("We couldn't complete the connection. Please try again or contact support.", 502);
  }

  if (!tokenResp.ok) {
    console.error("QBO token exchange failed", tokenResp.status);
    return page("We couldn't complete the connection. Please try again or contact support.", 502);
  }

  const tokens = (await tokenResp.json()) as {
    access_token?: unknown;
    refresh_token?: unknown;
    expires_in?: unknown;
    x_refresh_token_expires_in?: unknown;
  };
  if (typeof tokens.access_token !== "string" || typeof tokens.refresh_token !== "string") {
    console.error("QBO token exchange returned an incomplete payload");
    return page("We couldn't complete the connection. Please try again or contact support.", 502);
  }

  console.log("QBO connected:", {
    customer: clientSlug,
    realmId,
    connected_at: new Date().toISOString(),
  });

  let companyName = "Unknown Company";
  try {
    const companyResp = await intuitFetch(
      `https://quickbooks.api.intuit.com/v3/company/${encodeURIComponent(realmId)}/companyinfo/${encodeURIComponent(realmId)}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          Accept: "application/json",
        },
      },
    );
    if (companyResp.ok) {
      const companyData = (await companyResp.json()) as {
        CompanyInfo?: { CompanyName?: unknown };
        CompanyName?: unknown;
      };
      const fromInfo = companyData.CompanyInfo?.CompanyName;
      const fromRoot = companyData.CompanyName;
      if (typeof fromInfo === "string" && fromInfo.trim()) companyName = fromInfo;
      else if (typeof fromRoot === "string" && fromRoot.trim()) companyName = fromRoot;
      console.log("QBO CompanyInfo fetched for", clientSlug);
    } else {
      console.warn("QBO CompanyInfo fetch failed", companyResp.status);
    }
  } catch (err) {
    console.error("QBO CompanyInfo fetch error", err instanceof Error ? err.name : "error");
  }

  const now = Date.now();
  const expiresIn = typeof tokens.expires_in === "number" ? tokens.expires_in : 3600;
  const refreshExpiresIn =
    typeof tokens.x_refresh_token_expires_in === "number" ? tokens.x_refresh_token_expires_in : 100 * 24 * 3600;
  const tokenRecord: QboTokenRecord = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    realmId,
    company_name: companyName,
    expires_at: now + expiresIn * 1000,
    refresh_token_expires_at: now + refreshExpiresIn * 1000,
    connected_at: existing?.connected_at || new Date(now).toISOString(),
    updated_at: new Date(now).toISOString(),
    needs_reauth: false,
  };

  try {
    await saveQboTokens(clientSlug, tokenRecord);
    console.log("QBO token persisted for client:", clientSlug);
  } catch (err) {
    console.error("QBO callback: failed to write token", err instanceof Error ? err.name : "error");
    return page("We couldn't save the QuickBooks connection. Please try again or contact support.", 500);
  }

  return page(
    `QuickBooks connected successfully for ${companyName} (${clientSlug}). You can close this window.`,
    200,
    true,
  );
}

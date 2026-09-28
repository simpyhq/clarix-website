import { createHmac, randomBytes } from "crypto";
import { getQboKv } from "@/lib/qbo-kv";
import { qboStateKey } from "@/lib/qbo-keys";
import { qboNow } from "@/lib/qbo-runtime";
import { isValidClientSlug, safeEqual } from "@/lib/qbo-security";

// 10 minutes is long enough to finish Intuit's company picker and short
// enough that a leaked callback URL dies quickly. The KV TTL is a minute
// longer so expiry is enforced by the signed timestamp, not a clock skew
// between Redis and this function.
export const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;
const OAUTH_STATE_KV_TTL_SECONDS = 11 * 60;
const STATE_KDF_LABEL = "clarixhq-qbo-oauth-state-v1";

export type OAuthStatePayload = {
  slug: string;
  nonce: string;
  exp: number;
};

export function resolveStateSigningKey(env: {
  QBO_OAUTH_STATE_SECRET?: string;
  KV_REST_API_TOKEN?: string;
  [key: string]: string | undefined;
}): string {
  if (env.QBO_OAUTH_STATE_SECRET) return env.QBO_OAUTH_STATE_SECRET;
  if (env.KV_REST_API_TOKEN) {
    // Domain-separated from the KV token. QBO_CLIENT_SECRET is not used:
    // that value was emailed in plaintext and must not be a signing key.
    return createHmac("sha256", STATE_KDF_LABEL).update(env.KV_REST_API_TOKEN).digest("base64url");
  }
  throw new Error("OAuth state signing key is not configured");
}

export function signOAuthState(payload: OAuthStatePayload, secret: string): string {
  const body = Buffer.from(
    JSON.stringify({ v: 1, slug: payload.slug, n: payload.nonce, exp: payload.exp }),
    "utf8",
  ).toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function readOAuthState(state: string, secret: string, now: number): OAuthStatePayload | null {
  if (state.length === 0 || state.length > 4096) return null;
  const dot = state.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = state.slice(0, dot);
  const sig = state.slice(dot + 1);
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  if (!safeEqual(sig, expected)) return null;

  let parsed: { v?: unknown; slug?: unknown; n?: unknown; exp?: unknown };
  try {
    parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      v?: unknown;
      slug?: unknown;
      n?: unknown;
      exp?: unknown;
    };
  } catch {
    return null;
  }
  if (parsed.v !== 1) return null;
  if (typeof parsed.slug !== "string" || !isValidClientSlug(parsed.slug)) return null;
  if (typeof parsed.n !== "string" || !/^[A-Za-z0-9_-]{16,128}$/.test(parsed.n)) return null;
  if (typeof parsed.exp !== "number" || !Number.isFinite(parsed.exp) || parsed.exp <= now) return null;
  return { slug: parsed.slug, nonce: parsed.n, exp: parsed.exp };
}

export async function createOAuthState(slug: string): Promise<string> {
  if (!isValidClientSlug(slug)) throw new Error("invalid slug");
  const secret = resolveStateSigningKey(process.env);
  const nonce = randomBytes(32).toString("base64url");
  const exp = qboNow() + OAUTH_STATE_TTL_MS;
  const state = signOAuthState({ slug, nonce, exp }, secret);
  await getQboKv().set(qboStateKey(nonce), slug, OAUTH_STATE_KV_TTL_SECONDS);
  return state;
}

// Verifies the signature and expiry, then deletes the nonce. A second use
// fails even if the signature is still within the expiry window.
export async function consumeOAuthState(state: string | null): Promise<string | null> {
  if (!state) return null;
  let secret: string;
  try {
    secret = resolveStateSigningKey(process.env);
  } catch {
    return null;
  }
  const parsed = readOAuthState(state, secret, qboNow());
  if (!parsed) return null;
  const stored = await getQboKv().getdel(qboStateKey(parsed.nonce));
  if (stored !== parsed.slug) return null;
  return parsed.slug;
}

export function qboConnectUrl(slug: string): string {
  let origin = "https://www.clarixhq.ai";
  const redirect = process.env.QBO_REDIRECT_URI || "https://www.clarixhq.ai/qbo/callback";
  try {
    origin = new URL(redirect).origin;
  } catch {
    origin = "https://www.clarixhq.ai";
  }
  const url = new URL("/qbo/connect", origin);
  url.searchParams.set("client", slug);
  return url.toString();
}

export function intuitAuthorizeUrl(state: string): string {
  const clientId = process.env.QBO_CLIENT_ID || "";
  const redirectUri = process.env.QBO_REDIRECT_URI || "";
  let redirect: URL;
  try {
    redirect = new URL(redirectUri);
  } catch {
    throw new Error("QBO OAuth is not configured");
  }
  if (redirect.protocol !== "https:" || !clientId) {
    throw new Error("QBO OAuth is not configured");
  }
  const url = new URL("https://appcenter.intuit.com/connect/oauth2");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "com.intuit.quickbooks.accounting");
  url.searchParams.set("state", state);
  return url.toString();
}

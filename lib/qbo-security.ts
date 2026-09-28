import { createHash, timingSafeEqual } from "crypto";

// Slugs used in KV keys and connect links. Existing clients
// (mikemills-buck, chp-primary, tcre-capital-buck, amtm-investments-buck)
// match. Uppercase is rejected so a key cannot be shadowed by case.
const CLIENT_SLUG = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;

const OAUTH_ERRORS = new Set([
  "access_denied",
  "invalid_scope",
  "invalid_request",
  "unauthorized_client",
  "server_error",
  "temporarily_unavailable",
]);

export const SAFE_TOKEN_DETAILS = ["reauth_required", "refresh_request_failed", "retry"] as const;
export type SafeTokenDetail = (typeof SAFE_TOKEN_DETAILS)[number];

export function isValidClientSlug(slug: string): boolean {
  return CLIENT_SLUG.test(slug);
}

export function isPlausibleRealmId(realmId: string): boolean {
  return /^[0-9A-Za-z]{1,64}$/.test(realmId);
}

export function isPlausibleAuthCode(code: string): boolean {
  if (code.length < 8 || code.length > 4096) return false;
  return !/[\u0000-\u0020<>]/.test(code);
}

// The callback identity is the verified state slug only. realmId is accepted
// as an argument so a caller cannot "helpfully" substitute it.
export function callbackClientSlug(verifiedSlug: string | null, realmId: string | null): string | null {
  // realmId is part of the signature so callers cannot substitute it for state.
  void realmId;
  if (!verifiedSlug || !isValidClientSlug(verifiedSlug)) return null;
  return verifiedSlug;
}

export function realmReconnectDecision(
  existingRealm: string | null | undefined,
  incomingRealm: string,
): "allow_new" | "allow_same" | "refuse_rebind" {
  if (!existingRealm) return "allow_new";
  if (existingRealm === incomingRealm) return "allow_same";
  return "refuse_rebind";
}

export const REBIND_REFUSAL_MESSAGE =
  "This client is already connected to a different QuickBooks company. The connection was not changed. Contact support if the company should be switched.";

export const REALM_COLLISION_MESSAGE =
  "This QuickBooks company is already connected to another client. Contact support.";

export const INVALID_STATE_MESSAGE =
  "This connection link is invalid or has expired. Start again from the Clarix connect link.";

export function oauthDenialMessage(errorParam: string | null): string {
  if (errorParam && OAUTH_ERRORS.has(errorParam)) {
    return `Connection cancelled or denied (${errorParam}).`;
  }
  return "Connection cancelled or denied.";
}

// Hash both sides so length differences do not bail out of timingSafeEqual.
export function safeEqual(a: string, b: string): boolean {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}

// Unset keeps today's shared-secret path working. Only an explicit off switch disables it.
export function sharedSecretAllowed(value: string | undefined): boolean {
  if (value === undefined || value === "") return true;
  const normalized = value.trim().toLowerCase();
  return !["0", "false", "no", "off"].includes(normalized);
}

export function cronAuthorized(authorizationHeader: string | null, cronSecret: string | undefined): boolean {
  if (!cronSecret) return false;
  if (!authorizationHeader) return false;
  const match = /^Bearer\s+(\S+)\s*$/i.exec(authorizationHeader);
  if (!match) return false;
  return safeEqual(match[1], cronSecret);
}

export function sanitizeIntuitFailure(
  status: number,
  bodyText: string,
): { invalidGrant: boolean; safeCode: string } {
  let errorCode = "";
  try {
    const parsed = JSON.parse(bodyText) as { error?: unknown };
    if (parsed && typeof parsed.error === "string") {
      errorCode = parsed.error.slice(0, 64);
    }
  } catch {
    errorCode = "";
  }
  const invalidGrant = status === 400 && (/invalid_grant/i.test(errorCode) || /invalid_grant/i.test(bodyText));
  return {
    invalidGrant,
    safeCode: invalidGrant ? "invalid_grant" : `http_${status || 0}`,
  };
}

// Historical KV rows stored Intuit bodies in last_refresh_error. Never show those.
export function publicRefreshError(stored: string | undefined): string | undefined {
  if (!stored) return undefined;
  if (
    stored === "invalid_grant" ||
    stored === "refresh_token_expired" ||
    stored === "http_timeout" ||
    /^http_\d+$/.test(stored)
  ) {
    return stored;
  }
  if (/invalid_grant/i.test(stored)) return "invalid_grant";
  return "refresh_error";
}

export function asSafeDetail(value: string | undefined): SafeTokenDetail | undefined {
  if (!value) return undefined;
  return (SAFE_TOKEN_DETAILS as readonly string[]).includes(value) ? (value as SafeTokenDetail) : undefined;
}

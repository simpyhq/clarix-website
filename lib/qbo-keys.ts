// Redis key layout for the QuickBooks integration.
// Token records stay at qbo:client:<slug>. Other keys use different prefixes
// so a qbo:client:* scan cannot pick up locks, nonces, or API-key hashes.

export const QBO_CLIENTS_KEY = "qbo:clients";

export function qboClientKey(slug: string): string {
  return `qbo:client:${slug}`;
}

export function qboGenKey(slug: string): string {
  return `qbo:gen:${slug}`;
}

export function qboLockKey(slug: string): string {
  return `qbo:lock:${slug}`;
}

export function qboStateKey(nonce: string): string {
  return `qbo:oauth-state:${nonce}`;
}

export function qboApiKeyKey(slug: string): string {
  return `qbo:apikey:${slug}`;
}

export const QBO_AUDIT_KEY = "qbo:audit";

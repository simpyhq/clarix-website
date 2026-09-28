import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { recordSecurityEvent } from "@/lib/qbo-audit";
import { getQboKv } from "@/lib/qbo-kv";
import { qboApiKeyKey } from "@/lib/qbo-keys";
import { parseApiKeyRecord, QboApiKeyRecord, QboCorruptRecordError, QboStorageError } from "@/lib/qbo-records";
import { qboNow } from "@/lib/qbo-runtime";
import { isValidClientSlug } from "@/lib/qbo-security";

const KEY_PREFIX = "cxk_";

// One previous key stays valid so a Mac mini can be updated without an outage.
export const CLIENT_KEY_OVERLAP_MS = 7 * 24 * 60 * 60 * 1000;

export function generateClientApiKey(): string {
  return KEY_PREFIX + randomBytes(32).toString("base64url");
}

export function hashClientApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

function hashesMatch(presented: string, expectedHex: string | undefined): boolean {
  const actual = createHash("sha256").update(presented).digest();
  const validHex = Boolean(expectedHex && /^[a-f0-9]{64}$/.test(expectedHex));
  const expected = validHex ? Buffer.from(expectedHex as string, "hex") : Buffer.alloc(32);
  const equal = timingSafeEqual(actual, expected);
  return validHex && equal;
}

export function presentedKeyMatches(record: QboApiKeyRecord | null, presented: string, now: number): boolean {
  if (!presented.startsWith(KEY_PREFIX) || presented.length < 16) {
    hashesMatch(presented, undefined);
    return false;
  }
  if (!record) {
    hashesMatch(presented, undefined);
    return false;
  }
  if (hashesMatch(presented, record.hash)) return true;
  if (record.previous_hash && record.previous_until) {
    const until = Date.parse(record.previous_until);
    if (Number.isFinite(until) && now < until && hashesMatch(presented, record.previous_hash)) {
      return true;
    }
  }
  return false;
}

export async function clientApiKeyMatches(slug: string, presented: string): Promise<boolean> {
  if (!isValidClientSlug(slug)) return false;
  const raw = await getQboKv().get(qboApiKeyKey(slug));
  const record = parseApiKeyRecord(raw);
  return presentedKeyMatches(record, presented, qboNow());
}

export type IssueClientKeyResult =
  | {
      ok: true;
      slug: string;
      apiKey: string;
      prefix: string;
      rotated: boolean;
      previousValidUntil: string | null;
    }
  | { ok: false; reason: "invalid_slug" | "key_exists" | "storage_error" | "corrupt_key_record" };

export async function issueClientApiKey(
  slug: string,
  options: { rotate: boolean; now?: number },
): Promise<IssueClientKeyResult> {
  if (!isValidClientSlug(slug)) return { ok: false, reason: "invalid_slug" };
  const now = options.now ?? Date.now();
  const kv = getQboKv();
  let existing: QboApiKeyRecord | null = null;
  try {
    const raw = await kv.get(qboApiKeyKey(slug));
    existing = parseApiKeyRecord(raw);
  } catch (err) {
    if (err instanceof QboCorruptRecordError) {
      if (!options.rotate) return { ok: false, reason: "corrupt_key_record" };
      existing = null;
    } else if (err instanceof QboStorageError) {
      return { ok: false, reason: "storage_error" };
    } else {
      return { ok: false, reason: "storage_error" };
    }
  }

  if (existing && !options.rotate) return { ok: false, reason: "key_exists" };

  const apiKey = generateClientApiKey();
  const record: QboApiKeyRecord = {
    hash: hashClientApiKey(apiKey),
    prefix: apiKey.slice(0, 12),
    created_at: new Date(now).toISOString(),
  };
  if (existing && options.rotate) {
    record.previous_hash = existing.hash;
    record.previous_prefix = existing.prefix;
    record.previous_until = new Date(now + CLIENT_KEY_OVERLAP_MS).toISOString();
  }

  try {
    await kv.set(qboApiKeyKey(slug), JSON.stringify(record));
  } catch {
    return { ok: false, reason: "storage_error" };
  }

  const rotated = Boolean(existing);
  await recordSecurityEvent({
    event: rotated ? "key_rotated" : "key_issued",
    slug,
  });

  return {
    ok: true,
    slug,
    apiKey,
    prefix: record.prefix,
    rotated,
    previousValidUntil: record.previous_until ?? null,
  };
}

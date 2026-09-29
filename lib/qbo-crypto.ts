// AES-256-GCM for QuickBooks token records in KV.
//
// QBO_TOKEN_ENC_KEY is the current key (base64 or 64 hex chars, 32 bytes).
// QBO_TOKEN_ENC_KEY_VERSION is the version stamped on new writes (default 1).
// QBO_TOKEN_ENC_KEYS holds older versions as `1:<key>,2:<key>` so a rotation
// can still read records written by the previous key.
//
// Plaintext records stay readable. The next save or compare-and-set writes
// them as ciphertext. If no key is configured, records stay plaintext and a
// warning is logged once per process.

import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { parseStoredJson, QboCorruptRecordError, QboStorageError, QboTokenRecord } from "@/lib/qbo-records";

const ALGORITHM = "aes-256-gcm";
const PURPOSE = "clarix-qbo-token";

export type TokenKeyRing = {
  currentVersion: number;
  keys: Map<number, Buffer>;
};

export type TokenEnvelope = {
  enc: "A256GCM";
  v: number;
  iv: string;
  tag: string;
  ct: string;
};

export type TokenStorageLabel = "missing" | "plaintext" | "unknown" | `v${number}`;

type KeyEnv = {
  QBO_TOKEN_ENC_KEY?: string;
  QBO_TOKEN_ENC_KEY_VERSION?: string;
  QBO_TOKEN_ENC_KEYS?: string;
  [key: string]: string | undefined;
};

let unsetKeyWarned = false;
let plaintextReadWarned = false;

export function resetTokenCryptoWarningsForTests(): void {
  if (process.env.NODE_ENV === "production") {
    throw new Error("token crypto test helpers cannot be used in production");
  }
  unsetKeyWarned = false;
  plaintextReadWarned = false;
}

function warnUnsetKey(): void {
  if (unsetKeyWarned) return;
  unsetKeyWarned = true;
  console.warn("QBO_TOKEN_ENC_KEY is unset; QuickBooks tokens are stored in plaintext");
}

function notePlaintextRead(keyConfigured: boolean): void {
  if (!keyConfigured) {
    warnUnsetKey();
    return;
  }
  if (plaintextReadWarned) return;
  plaintextReadWarned = true;
  console.warn("QBO token record is plaintext; it will be encrypted on the next write");
}

function decodeKeyMaterial(raw: string): Buffer | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^[a-fA-F0-9]{64}$/.test(trimmed)) return Buffer.from(trimmed, "hex");
  const decoded = Buffer.from(trimmed, "base64");
  if (decoded.length === 32) return decoded;
  return null;
}

function parseVersion(raw: string | undefined, fallback: number): number {
  if (!raw || !raw.trim()) return fallback;
  const version = Number(raw.trim());
  if (!Number.isInteger(version) || version < 1) {
    throw new QboStorageError("token encryption key version is invalid");
  }
  return version;
}

export function loadTokenKeyRing(env: KeyEnv = process.env): TokenKeyRing | null {
  const keys = new Map<number, Buffer>();
  const ring = env.QBO_TOKEN_ENC_KEYS?.trim();
  if (ring) {
    for (const part of ring.split(",")) {
      const piece = part.trim();
      if (!piece) continue;
      const sep = piece.indexOf(":");
      if (sep <= 0) throw new QboStorageError("token encryption key ring is invalid");
      const version = Number(piece.slice(0, sep));
      const material = decodeKeyMaterial(piece.slice(sep + 1));
      if (!Number.isInteger(version) || version < 1 || !material) {
        throw new QboStorageError("token encryption key ring is invalid");
      }
      keys.set(version, material);
    }
  }

  const currentRaw = env.QBO_TOKEN_ENC_KEY?.trim();
  if (currentRaw) {
    const version = parseVersion(env.QBO_TOKEN_ENC_KEY_VERSION, 1);
    const material = decodeKeyMaterial(currentRaw);
    if (!material) throw new QboStorageError("token encryption key is invalid");
    keys.set(version, material);
    return { currentVersion: version, keys };
  }

  if (keys.size === 0) return null;
  const currentVersion = Math.max(...keys.keys());
  return { currentVersion, keys };
}

function isEnvelope(value: unknown): value is TokenEnvelope {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as TokenEnvelope;
  return (
    record.enc === "A256GCM" &&
    typeof record.v === "number" &&
    Number.isInteger(record.v) &&
    record.v >= 1 &&
    typeof record.iv === "string" &&
    typeof record.tag === "string" &&
    typeof record.ct === "string"
  );
}

function asTokenRecord(value: unknown): QboTokenRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new QboCorruptRecordError();
  return value as QboTokenRecord;
}

function seal(plaintext: string, ring: TokenKeyRing): string {
  const key = ring.keys.get(ring.currentVersion);
  if (!key) throw new QboStorageError("token encryption key is invalid");
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  cipher.setAAD(Buffer.from(`${PURPOSE}:${ring.currentVersion}`));
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  const envelope: TokenEnvelope = {
    enc: "A256GCM",
    v: ring.currentVersion,
    iv: iv.toString("base64url"),
    tag: tag.toString("base64url"),
    ct: ct.toString("base64url"),
  };
  return JSON.stringify(envelope);
}

function open(envelope: TokenEnvelope, ring: TokenKeyRing): string {
  const key = ring.keys.get(envelope.v);
  if (!key) {
    console.error("QBO token decrypt failed", `v${envelope.v}`);
    throw new QboCorruptRecordError();
  }
  try {
    const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(envelope.iv, "base64url"));
    decipher.setAAD(Buffer.from(`${PURPOSE}:${envelope.v}`));
    decipher.setAuthTag(Buffer.from(envelope.tag, "base64url"));
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(envelope.ct, "base64url")),
      decipher.final(),
    ]);
    return plaintext.toString("utf8");
  } catch {
    console.error("QBO token decrypt failed", `v${envelope.v}`);
    throw new QboCorruptRecordError();
  }
}

export function encodeTokenForStorage(record: QboTokenRecord, env: KeyEnv = process.env): string {
  const json = JSON.stringify(record);
  const ring = loadTokenKeyRing(env);
  if (!ring) {
    warnUnsetKey();
    return json;
  }
  return seal(json, ring);
}

export function decodeTokenFromStorage(raw: unknown, env: KeyEnv = process.env): QboTokenRecord | null {
  const parsed = parseStoredJson(raw);
  if (parsed === null) return null;
  const ring = loadTokenKeyRing(env);
  if (isEnvelope(parsed)) {
    if (!ring) {
      console.error("QBO token record is encrypted but no decryption key is configured");
      throw new QboCorruptRecordError();
    }
    return asTokenRecord(JSON.parse(open(parsed, ring)));
  }
  notePlaintextRead(ring !== null);
  return asTokenRecord(parsed);
}

export function tokenStorageLabel(raw: unknown): TokenStorageLabel {
  if (raw === null || raw === undefined || raw === "") return "missing";
  try {
    const parsed = parseStoredJson(raw);
    if (parsed === null) return "missing";
    if (isEnvelope(parsed)) return `v${parsed.v}`;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed) && "access_token" in parsed) {
      return "plaintext";
    }
    return "unknown";
  } catch {
    return "unknown";
  }
}

export function tokenRecordIsPlaintext(raw: unknown): boolean {
  return tokenStorageLabel(raw) === "plaintext";
}

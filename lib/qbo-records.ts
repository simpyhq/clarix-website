export class QboStorageError extends Error {
  constructor(message = "KV request failed") {
    super(message);
    this.name = "QboStorageError";
  }
}

export class QboCorruptRecordError extends Error {
  constructor() {
    super("corrupted qbo record");
    this.name = "QboCorruptRecordError";
  }
}

export interface QboTokenRecord {
  access_token: string;
  refresh_token: string;
  realmId: string;
  company_name?: string;
  expires_at: number;
  refresh_token_expires_at: number;
  connected_at: string;
  updated_at: string;
  last_refresh_error?: string;
  last_refresh_at?: string;
  needs_reauth?: boolean;
}

export interface QboApiKeyRecord {
  hash: string;
  prefix: string;
  created_at: string;
  previous_hash?: string;
  previous_prefix?: string;
  previous_until?: string;
}

export function parseStoredJson(raw: unknown): unknown {
  if (raw === null || raw === undefined) return null;
  let parsed: unknown = raw;
  for (let i = 0; i < 3 && typeof parsed === "string"; i++) {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      throw new QboCorruptRecordError();
    }
  }
  return parsed;
}

export function parseTokenRecord(raw: unknown): QboTokenRecord | null {
  const parsed = parseStoredJson(raw);
  if (parsed === null) return null;
  if (typeof parsed !== "object" || Array.isArray(parsed)) throw new QboCorruptRecordError();
  return parsed as QboTokenRecord;
}

export function parseApiKeyRecord(raw: unknown): QboApiKeyRecord | null {
  const parsed = parseStoredJson(raw);
  if (parsed === null) return null;
  if (typeof parsed !== "object" || Array.isArray(parsed)) throw new QboCorruptRecordError();
  const record = parsed as QboApiKeyRecord;
  if (typeof record.hash !== "string" || typeof record.prefix !== "string") {
    throw new QboCorruptRecordError();
  }
  return record;
}

// Missing generation means the record has never been written by the CAS path.
export function parseGeneration(raw: unknown): number {
  if (raw === null || raw === undefined || raw === "") return 0;
  if (typeof raw === "number" && Number.isInteger(raw) && raw >= 0) return raw;
  if (typeof raw !== "string") throw new QboCorruptRecordError();
  let value: unknown = raw;
  for (let i = 0; i < 3 && typeof value === "string"; i++) {
    if (/^\d+$/.test(value)) return Number(value);
    try {
      value = JSON.parse(value);
    } catch {
      throw new QboCorruptRecordError();
    }
  }
  if (typeof value === "number" && Number.isInteger(value) && value >= 0) return value;
  if (typeof value === "string" && /^\d+$/.test(value)) return Number(value);
  throw new QboCorruptRecordError();
}

export function isServableAccessToken(record: QboTokenRecord | null, now: number): record is QboTokenRecord {
  if (!record) return false;
  if (typeof record.access_token !== "string" || record.access_token.length === 0) return false;
  if (typeof record.realmId !== "string" || record.realmId.length === 0) return false;
  if (typeof record.expires_at !== "number" || !(record.expires_at > now)) return false;
  if (record.needs_reauth) return false;
  return true;
}

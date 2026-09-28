import { getKvOverride } from "@/lib/qbo-runtime";
import { QboCorruptRecordError, QboStorageError } from "@/lib/qbo-records";

// Atomic operations used by token refresh. The Lua below is the production
// implementation. tests/memory-kv.ts implements the same contract in-process
// and is what the tests execute. Keep the two in sync.
//
// Compare-and-set is on a generation counter, not the token JSON, so an older
// refresh cannot overwrite a newer grant. Lock release deletes the key only
// when the stored owner id still matches.

const ACQUIRE_LOCK_LUA = `
local ok = redis.call('SET', KEYS[1], ARGV[1], 'NX', 'EX', tonumber(ARGV[2]))
if ok == false or ok == nil then return 0 end
return 1
`;

const RELEASE_LOCK_LUA = `
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('DEL', KEYS[1])
else
  return 0
end
`;

const CAS_RECORD_LUA = `
local gen = redis.call('GET', KEYS[2])
if gen == false or gen == nil then
  gen = '0'
elseif not string.match(gen, '^%d+$') then
  return -1
end
if gen ~= ARGV[1] then return 0 end
local nextGen = tostring((tonumber(gen) or 0) + 1)
redis.call('SET', KEYS[1], ARGV[2])
redis.call('SET', KEYS[2], nextGen)
return 1
`;

const WRITE_RECORD_LUA = `
local gen = redis.call('GET', KEYS[2])
local n = 0
if gen == false or gen == nil then
  n = 0
elseif not string.match(gen, '^%d+$') then
  return -1
else
  n = tonumber(gen) or 0
end
local nextGen = n + 1
redis.call('SET', KEYS[1], ARGV[1])
redis.call('SET', KEYS[2], tostring(nextGen))
redis.call('SADD', KEYS[3], ARGV[2])
return nextGen
`;

const GETDEL_LUA = `
local v = redis.call('GET', KEYS[1])
if v == false or v == nil then return false end
redis.call('DEL', KEYS[1])
return v
`;

export interface QboKv {
  get(key: string): Promise<unknown>;
  set(key: string, value: string, exSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  getdel(key: string): Promise<unknown>;
  sadd(key: string, member: string): Promise<void>;
  srem(key: string, member: string): Promise<void>;
  smembers(key: string): Promise<string[]>;
  keys(pattern: string): Promise<string[]>;
  acquireLock(key: string, owner: string, ttlSeconds: number): Promise<boolean>;
  releaseLock(key: string, owner: string): Promise<boolean>;
  casRecord(recordKey: string, genKey: string, expectedGen: string, json: string): Promise<boolean>;
  writeRecord(
    recordKey: string,
    genKey: string,
    clientsKey: string,
    json: string,
    slug: string,
  ): Promise<number>;
}

function kvBase(): string {
  const base = process.env.KV_REST_API_URL || "";
  const token = process.env.KV_REST_API_TOKEN || "";
  if (!base || !token) throw new QboStorageError("KV is not configured");
  return base.replace(/\/$/, "");
}

function kvToken(): string {
  const token = process.env.KV_REST_API_TOKEN || "";
  if (!token) throw new QboStorageError("KV is not configured");
  return token;
}

async function kvRequest(path: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(`${kvBase()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${kvToken()}`,
      ...(init?.headers || {}),
    },
    signal: AbortSignal.timeout(8_000),
  });
  let body: { result?: unknown; error?: unknown } = {};
  try {
    body = (await res.json()) as { result?: unknown; error?: unknown };
  } catch {
    body = {};
  }
  if (!res.ok || body.error) {
    throw new QboStorageError(`KV request failed (${res.status})`);
  }
  return body.result;
}

async function redisEval(script: string, keys: string[], args: string[]): Promise<unknown> {
  return kvRequest("", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(["EVAL", script, String(keys.length), ...keys, ...args]),
  });
}

function asCount(result: unknown): number {
  if (typeof result === "number" && Number.isFinite(result)) return result;
  if (typeof result === "string" && /^-?\d+$/.test(result)) return Number(result);
  return 0;
}

function asStringList(result: unknown): string[] {
  if (!Array.isArray(result)) return [];
  return result.filter((item): item is string => typeof item === "string");
}

const restKv: QboKv = {
  async get(key) {
    return kvRequest(`/get/${encodeURIComponent(key)}`);
  },

  async set(key, value, exSeconds) {
    if (exSeconds !== undefined) {
      // Path form is SET key value EX seconds. Used for URL-safe values
      // such as OAuth nonces. JSON records use the body form below.
      await kvRequest(
        `/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}/EX/${exSeconds}`,
        { method: "POST" },
      );
      return;
    }
    await kvRequest(`/set/${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: value,
    });
  },

  async del(key) {
    await kvRequest(`/del/${encodeURIComponent(key)}`, { method: "POST" });
  },

  async getdel(key) {
    const result = await redisEval(GETDEL_LUA, [key], []);
    if (result === false || result === null || result === undefined) return null;
    return result;
  },

  async sadd(key, member) {
    await kvRequest(`/sadd/${encodeURIComponent(key)}/${encodeURIComponent(member)}`, { method: "POST" });
  },

  async srem(key, member) {
    await kvRequest(`/srem/${encodeURIComponent(key)}/${encodeURIComponent(member)}`, { method: "POST" });
  },

  async smembers(key) {
    return asStringList(await kvRequest(`/smembers/${encodeURIComponent(key)}`));
  },

  async keys(pattern) {
    return asStringList(await kvRequest(`/keys/${encodeURIComponent(pattern)}`));
  },

  async acquireLock(key, owner, ttlSeconds) {
    const result = await redisEval(ACQUIRE_LOCK_LUA, [key], [owner, String(ttlSeconds)]);
    return asCount(result) === 1;
  },

  async releaseLock(key, owner) {
    const result = await redisEval(RELEASE_LOCK_LUA, [key], [owner]);
    return asCount(result) > 0;
  },

  async casRecord(recordKey, genKey, expectedGen, json) {
    const result = await redisEval(CAS_RECORD_LUA, [recordKey, genKey], [expectedGen, json]);
    const count = asCount(result);
    if (count < 0) throw new QboCorruptRecordError();
    return count === 1;
  },

  async writeRecord(recordKey, genKey, clientsKey, json, slug) {
    const result = await redisEval(WRITE_RECORD_LUA, [recordKey, genKey, clientsKey], [json, slug]);
    const count = asCount(result);
    if (count < 0) throw new QboCorruptRecordError();
    if (count < 1) throw new QboStorageError("KV write did not confirm");
    return count;
  },
};

export function getQboKv(): QboKv {
  return getKvOverride() ?? restKv;
}

import { QboCorruptRecordError } from "../lib/qbo-records";
import type { QboKv } from "../lib/qbo-kv";

// In-process stand-in for the Lua in lib/qbo-kv.ts. Tests run this. Production
// runs the Lua. The generation and lock rules below are the contract.

type Entry = { value: string; expiresAt: number | null };

function parseGen(raw: string | null): number {
  if (raw === null) return 0;
  if (!/^\d+$/.test(raw)) throw new QboCorruptRecordError();
  return Number(raw);
}

export function createMemoryKv(now: () => number = Date.now): QboKv {
  const strings = new Map<string, Entry>();
  const sets = new Map<string, Set<string>>();

  function readString(key: string): string | null {
    const entry = strings.get(key);
    if (!entry) return null;
    if (entry.expiresAt !== null && entry.expiresAt <= now()) {
      strings.delete(key);
      return null;
    }
    return entry.value;
  }

  return {
    async get(key) {
      return readString(key);
    },

    async set(key, value, exSeconds) {
      strings.set(key, {
        value,
        expiresAt: exSeconds === undefined ? null : now() + exSeconds * 1000,
      });
    },

    async del(key) {
      strings.delete(key);
    },

    async getdel(key) {
      const value = readString(key);
      strings.delete(key);
      return value;
    },

    async sadd(key, member) {
      const set = sets.get(key) ?? new Set<string>();
      set.add(member);
      sets.set(key, set);
    },

    async srem(key, member) {
      sets.get(key)?.delete(member);
    },

    async smembers(key) {
      return [...(sets.get(key) ?? [])];
    },

    async keys(pattern) {
      const prefix = pattern.endsWith("*") ? pattern.slice(0, -1) : null;
      const found: string[] = [];
      for (const key of strings.keys()) {
        const matches = prefix === null ? key === pattern : key.startsWith(prefix);
        if (matches && readString(key) !== null) found.push(key);
      }
      return found;
    },

    async acquireLock(key, owner, ttlSeconds) {
      if (readString(key) !== null) return false;
      strings.set(key, { value: owner, expiresAt: now() + ttlSeconds * 1000 });
      return true;
    },

    async releaseLock(key, owner) {
      if (readString(key) !== owner) return false;
      strings.delete(key);
      return true;
    },

    async casRecord(recordKey, genKey, expectedGen, json) {
      const gen = parseGen(readString(genKey));
      if (String(gen) !== expectedGen) return false;
      const next = gen + 1;
      strings.set(recordKey, { value: json, expiresAt: null });
      strings.set(genKey, { value: String(next), expiresAt: null });
      return true;
    },

    async writeRecord(recordKey, genKey, clientsKey, json, slug) {
      const next = parseGen(readString(genKey)) + 1;
      strings.set(recordKey, { value: json, expiresAt: null });
      strings.set(genKey, { value: String(next), expiresAt: null });
      const set = sets.get(clientsKey) ?? new Set<string>();
      set.add(slug);
      sets.set(clientsKey, set);
      return next;
    },
  };
}

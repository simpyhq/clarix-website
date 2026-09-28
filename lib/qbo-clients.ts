import { getQboKv } from "@/lib/qbo-kv";
import { QBO_CLIENTS_KEY } from "@/lib/qbo-keys";
import { isValidClientSlug } from "@/lib/qbo-security";

const CLIENT_KEY_PREFIX = "qbo:client:";

// Union of the qbo:clients registry and any qbo:client:* records already in KV.
// Existing companies (including chp-primary) are picked up from the key scan
// without a manual backfill. Newly discovered slugs are added to the registry.
export async function listQboClientSlugs(): Promise<string[]> {
  const kv = getQboKv();
  const [members, keyNames] = await Promise.all([kv.smembers(QBO_CLIENTS_KEY), kv.keys("qbo:client:*")]);
  const slugs = new Set<string>();

  for (const member of members) {
    if (isValidClientSlug(member)) slugs.add(member);
  }
  for (const key of keyNames) {
    if (!key.startsWith(CLIENT_KEY_PREFIX)) continue;
    const slug = key.slice(CLIENT_KEY_PREFIX.length);
    if (isValidClientSlug(slug)) slugs.add(slug);
  }

  for (const slug of slugs) {
    if (members.includes(slug)) continue;
    try {
      await kv.sadd(QBO_CLIENTS_KEY, slug);
    } catch (err) {
      console.error("QBO client registry backfill failed", slug, err instanceof Error ? err.name : "error");
    }
  }

  return [...slugs].sort();
}

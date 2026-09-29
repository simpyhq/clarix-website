// Issue or rotate the per-client key for one QuickBooks slug.
//
// The plaintext key is printed once. KV stores only its SHA-256 hash.
// Requires KV_REST_API_URL and KV_REST_API_TOKEN in the environment
// (for example from `vercel env pull`). Do not commit those values.
//
//   npx tsx scripts/issue-qbo-client-key.ts <slug>
//   npx tsx scripts/issue-qbo-client-key.ts <slug> --rotate
//
// --rotate keeps the previous key valid for 7 days. Rotating a corrupt
// record replaces it.

import { issueClientApiKey } from "../lib/qbo-client-keys";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const rotate = args.includes("--rotate");
  const slug = args.find((arg) => !arg.startsWith("--"));
  if (!slug) {
    console.error("Usage: npx tsx scripts/issue-qbo-client-key.ts <slug> [--rotate]");
    process.exit(1);
  }
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.error("Set KV_REST_API_URL and KV_REST_API_TOKEN. Do not commit them.");
    process.exit(1);
  }

  const result = await issueClientApiKey(slug, { rotate });
  if (!result.ok) {
    console.error(`Failed: ${result.reason}`);
    process.exit(1);
  }

  console.log(`Client: ${result.slug}`);
  console.log(`Prefix: ${result.prefix}`);
  if (result.previousValidUntil) {
    console.log(`Previous key remains valid until ${result.previousValidUntil}`);
  }
  console.log(`API key (shown once): ${result.apiKey}`);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.name : "failed");
  process.exit(1);
});

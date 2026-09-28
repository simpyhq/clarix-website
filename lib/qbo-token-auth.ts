import { clientApiKeyMatches } from "@/lib/qbo-client-keys";
import { QboCorruptRecordError, QboStorageError } from "@/lib/qbo-records";
import { isValidClientSlug, safeEqual, sharedSecretAllowed } from "@/lib/qbo-security";

// Per-client key wins when the header is present, including when it is wrong.
// Falling through to the shared secret would let a stolen shared secret keep
// working on a mini that had already migrated.
export async function authorizeQboApiRequest(input: {
  slug: string | null;
  clientKey: string | null;
  sharedSecret: string | null;
}): Promise<"ok" | "unauthorized" | "storage_error"> {
  const clientKey = input.clientKey?.trim() ?? "";
  if (clientKey) {
    if (!input.slug || !isValidClientSlug(input.slug)) return "unauthorized";
    try {
      const ok = await clientApiKeyMatches(input.slug, clientKey);
      return ok ? "ok" : "unauthorized";
    } catch (err) {
      if (err instanceof QboStorageError || err instanceof QboCorruptRecordError) return "storage_error";
      return "storage_error";
    }
  }

  if (!sharedSecretAllowed(process.env.QBO_ALLOW_SHARED_SECRET)) return "unauthorized";
  const expected = process.env.QBO_TOKEN_API_SECRET;
  if (!expected || !input.sharedSecret) return "unauthorized";
  return safeEqual(input.sharedSecret, expected) ? "ok" : "unauthorized";
}

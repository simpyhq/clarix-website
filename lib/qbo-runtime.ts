import type { QboKv } from "@/lib/qbo-kv";

// Intuit's token endpoint is called while the per-client lock is held.
// The timeout must stay shorter than the lock TTL so a slow call cannot
// outlive the lock and race a second refresh.
export type RefreshTiming = {
  lockTtlSeconds: number;
  lockWaitMs: number;
  lockMaxWaitMs: number;
  intuitTimeoutMs: number;
};

const DEFAULT_TIMING: RefreshTiming = {
  lockTtlSeconds: 20,
  lockWaitMs: 300,
  lockMaxWaitMs: 12_000,
  intuitTimeoutMs: 8_000,
};

type HookState = {
  kv: QboKv | null;
  fetch: typeof fetch | null;
  now: (() => number) | null;
  timing: Partial<RefreshTiming> | null;
};

const hooks: HookState = {
  kv: null,
  fetch: null,
  now: null,
  timing: null,
};

function assertHooksAllowed(): void {
  if (process.env.NODE_ENV === "production") {
    throw new Error("QBO test hooks cannot be used in production");
  }
}

export function setQboTestHooks(
  next: {
    kv?: QboKv | null;
    fetch?: typeof fetch | null;
    now?: (() => number) | null;
    timing?: Partial<RefreshTiming> | null;
  } | null,
): void {
  assertHooksAllowed();
  if (!next) {
    hooks.kv = null;
    hooks.fetch = null;
    hooks.now = null;
    hooks.timing = null;
    return;
  }
  if (next.kv !== undefined) hooks.kv = next.kv;
  if (next.fetch !== undefined) hooks.fetch = next.fetch;
  if (next.now !== undefined) hooks.now = next.now;
  if (next.timing !== undefined) hooks.timing = next.timing;
}

export function getKvOverride(): QboKv | null {
  return hooks.kv;
}

export function qboNow(): number {
  return hooks.now ? hooks.now() : Date.now();
}

export function qboTiming(): RefreshTiming {
  return { ...DEFAULT_TIMING, ...hooks.timing };
}

export function qboFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const impl = hooks.fetch ?? fetch;
  return impl(input, init);
}

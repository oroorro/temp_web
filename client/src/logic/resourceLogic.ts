export type ResourceStatus = 'idle' | 'loading' | 'success' | 'error';

/** One cached server resource. `stale` means "refetch as soon as someone is looking". */
export interface ResourceEntry<T = unknown> {
  status: ResourceStatus;
  data?: T;
  error?: string;
  updatedAt?: number;
  stale: boolean;
}

export type ResourceEntries = Record<string, ResourceEntry>;

export interface ResourceView<T> {
  data: T | undefined;
  error: string | null;
  /** First load: nothing to show yet. */
  isLoading: boolean;
  /** Reloading while older data is still on screen. */
  isRefreshing: boolean;
}

export const DEFAULT_STALE_MS = 30_000;

export function beginEntry(entry: ResourceEntry | undefined): ResourceEntry {
  return { ...entry, status: 'loading', error: undefined, stale: false };
}

/** `stale` is left alone on purpose: an invalidation that arrived mid-flight must survive. */
export function resolveEntry(entry: ResourceEntry | undefined, data: unknown, now: number): ResourceEntry {
  return { status: 'success', data, updatedAt: now, stale: entry?.stale ?? false };
}

export function rejectEntry(entry: ResourceEntry | undefined, error: string): ResourceEntry {
  return { ...entry, status: 'error', error, stale: false };
}

/** Replaces the data of an entry while keeping whatever request state it is in. */
export function withData(entry: ResourceEntry | undefined, data: unknown, now: number): ResourceEntry {
  return { status: 'success', stale: false, ...entry, data, updatedAt: now };
}

export function markStale(entries: ResourceEntries, prefixes: string[]): ResourceEntries {
  const next: ResourceEntries = {};
  for (const [key, entry] of Object.entries(entries)) {
    const matches = prefixes.some((prefix) => key.startsWith(prefix));
    next[key] = matches && !entry.stale ? { ...entry, stale: true } : entry;
  }
  return next;
}

/** Decides whether a component that just started watching a key should hit the network. */
export function shouldFetch(entry: ResourceEntry | undefined, staleMs: number, now: number): boolean {
  if (!entry || entry.status === 'idle') return true;
  if (entry.status === 'loading') return false;
  if (entry.stale || entry.status === 'error') return true;
  return now - (entry.updatedAt ?? 0) > staleMs;
}

export function needsRevalidation(entry: ResourceEntry | undefined): boolean {
  return entry !== undefined && entry.stale && entry.status !== 'loading';
}

export function describeResource<T>(entry: ResourceEntry<T> | undefined, fallback: T | undefined): ResourceView<T> {
  const data = entry?.data ?? fallback;
  const pending = !entry || entry.status === 'idle' || entry.status === 'loading';
  return {
    data,
    error: entry?.status === 'error' ? (entry.error ?? 'Something went wrong') : null,
    isLoading: pending && data === undefined,
    isRefreshing: pending && data !== undefined,
  };
}

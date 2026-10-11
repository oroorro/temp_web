import { create } from 'zustand';
import { describeError } from '../logic/mutationLogic';
import { beginEntry, markStale, rejectEntry, resolveEntry, withData } from '../logic/resourceLogic';
import type { ResourceEntries } from '../logic/resourceLogic';

interface ResourceState {
  entries: ResourceEntries;
  begin: (key: string) => void;
  resolve: (key: string, data: unknown) => void;
  reject: (key: string, error: string) => void;
  /** Swaps the cached data without touching the loading state. */
  setData: (key: string, data: unknown) => void;
  /** Marks every entry whose key starts with one of `prefixes` as stale. */
  invalidate: (prefixes: string[]) => void;
}

/** Cache of everything fetched from the API, keyed by `api/keys.ts`. */
export const useResourceStore = create<ResourceState>()((set) => {
  const update = (key: string, change: (entry: ResourceEntries[string] | undefined) => ResourceEntries[string]) =>
    set((state) => ({ entries: { ...state.entries, [key]: change(state.entries[key]) } }));

  return {
    entries: {},
    begin: (key) => update(key, beginEntry),
    resolve: (key, data) => update(key, (entry) => resolveEntry(entry, data, Date.now())),
    reject: (key, error) => update(key, (entry) => rejectEntry(entry, error)),
    setData: (key, data) => update(key, (entry) => withData(entry, data, Date.now())),
    invalidate: (prefixes) => set((state) => ({ entries: markStale(state.entries, prefixes) })),
  };
});

const inFlight = new Map<string, Promise<unknown>>();

/**
 * Fetches `key` and records the outcome in the store. Concurrent calls for the
 * same key share one request. The returned promise rejects on failure.
 */
export function loadResource<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const existing = inFlight.get(key);
  if (existing) return existing as Promise<T>;

  const { begin, resolve, reject } = useResourceStore.getState();
  begin(key);

  const promise = fetcher()
    .then(
      (data) => {
        resolve(key, data);
        return data;
      },
      (error: unknown) => {
        reject(key, describeError(error));
        throw error;
      },
    )
    .finally(() => inFlight.delete(key));

  inFlight.set(key, promise);
  return promise;
}

/**
 * Applies `change` to cached data right away and returns a function that puts
 * the old data back, for when the request behind the change fails.
 */
export function optimisticUpdate<T>(key: string, change: (current: T) => T): (() => void) | undefined {
  const { entries, setData } = useResourceStore.getState();
  const previous = entries[key]?.data as T | undefined;
  if (previous === undefined) return undefined;

  setData(key, change(previous));
  return () => setData(key, previous);
}

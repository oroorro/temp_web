import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_STALE_MS, describeResource, needsRevalidation, shouldFetch } from '../../logic/resourceLogic';
import type { ResourceEntry, ResourceView } from '../../logic/resourceLogic';
import { loadResource, useResourceStore } from '../../store/resourceStore';
import { useLatest } from './useLatest';

export interface ResourceOptions {
  /** How long a successful response counts as fresh. */
  staleMs?: number;
  /** While a new key loads, keep returning the data of the previous key. */
  keepPrevious?: boolean;
}

export interface ResourceResult<T> extends ResourceView<T> {
  refetch: () => void;
}

/**
 * Reads a server resource through the shared cache: fetches it when missing or
 * stale, and again whenever a mutation invalidates its key.
 */
export function useResource<T>(key: string, fetcher: () => Promise<T>, options: ResourceOptions = {}): ResourceResult<T> {
  const { staleMs = DEFAULT_STALE_MS, keepPrevious = false } = options;
  const entry = useResourceStore((state) => state.entries[key]) as ResourceEntry<T> | undefined;
  const fetcherRef = useLatest(fetcher);
  const [previous, setPrevious] = useState<T>();

  const load = useCallback(
    (target: string) => {
      // A failure is already recorded in the store, so the rejection is not needed here.
      loadResource(target, () => fetcherRef.current()).catch(() => undefined);
    },
    [fetcherRef],
  );

  useEffect(() => {
    const current = useResourceStore.getState().entries[key];
    if (shouldFetch(current, staleMs, Date.now())) load(key);
  }, [key, staleMs, load]);

  const isInvalidated = needsRevalidation(entry);
  useEffect(() => {
    if (isInvalidated) load(key);
  }, [isInvalidated, key, load]);

  const data = entry?.data;
  useEffect(() => {
    if (data !== undefined) setPrevious(() => data);
  }, [data]);

  const refetch = useCallback(() => load(key), [key, load]);

  return useMemo(
    () => ({ ...describeResource(entry, keepPrevious ? previous : undefined), refetch }),
    [entry, keepPrevious, previous, refetch],
  );
}

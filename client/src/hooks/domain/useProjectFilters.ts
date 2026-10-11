import { useMemo } from 'react';
import { hasActiveProjectFilters, resolveProjectQuery } from '../../logic/projectLogic';
import { useFilterStore } from '../../store/filterStore';
import { useDebouncedValue } from '../core/useDebouncedValue';
import { useWorkspaceSettings } from './useWorkspaceSettings';

const SEARCH_DEBOUNCE_MS = 250;

/** Project list filters from the global store, plus the API query they translate to. */
export function useProjectFilters() {
  const filters = useFilterStore((state) => state.projects);
  const setFilter = useFilterStore((state) => state.setProjectFilter);
  const reset = useFilterStore((state) => state.resetProjectFilters);
  const { settings } = useWorkspaceSettings();
  const debouncedSearch = useDebouncedValue(filters.search, SEARCH_DEBOUNCE_MS);

  const query = useMemo(
    () => resolveProjectQuery(filters, debouncedSearch, settings.defaultProjectSort),
    [filters, debouncedSearch, settings.defaultProjectSort],
  );

  return { filters, query, setFilter, reset, isFiltered: hasActiveProjectFilters(filters) };
}

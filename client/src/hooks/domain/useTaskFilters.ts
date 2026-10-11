import { useMemo } from 'react';
import { hasActiveTaskFilters } from '../../logic/taskLogic';
import { useFilterStore } from '../../store/filterStore';
import type { TaskFilters } from '../../types/ui';
import { useDebouncedValue } from '../core/useDebouncedValue';

const SEARCH_DEBOUNCE_MS = 200;

/** Board filters from the global store; `applied` lags behind typing so the board does not flicker. */
export function useTaskFilters() {
  const filters = useFilterStore((state) => state.tasks);
  const setFilter = useFilterStore((state) => state.setTaskFilter);
  const reset = useFilterStore((state) => state.resetTaskFilters);
  const debouncedSearch = useDebouncedValue(filters.search, SEARCH_DEBOUNCE_MS);

  const applied = useMemo<TaskFilters>(() => ({ ...filters, search: debouncedSearch }), [filters, debouncedSearch]);

  return { filters, applied, setFilter, reset, isFiltered: hasActiveTaskFilters(filters) };
}

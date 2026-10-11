import { useCallback, useState } from 'react';
import {
  INITIAL_TEAM_VIEW,
  clearSelection,
  clearTeamFilters,
  hasActiveTeamFilters,
  toggleSelection,
} from '../../logic/teamLogic';
import type { TeamView } from '../../types/ui';

/**
 * View options of the Team page. They are component state rather than a store
 * entry: none of them reach the API, and they reset when the page unmounts.
 */
export function useTeamView() {
  const [view, setView] = useState(INITIAL_TEAM_VIEW);

  const setOption = useCallback(
    <K extends keyof TeamView>(name: K, value: TeamView[K]) => setView((current) => ({ ...current, [name]: value })),
    [],
  );
  const toggleMember = useCallback((memberId: string) => setView((current) => toggleSelection(current, memberId)), []);
  const closeMember = useCallback(() => setView(clearSelection), []);
  const resetFilters = useCallback(() => setView(clearTeamFilters), []);

  return { view, setOption, toggleMember, closeMember, resetFilters, isFiltered: hasActiveTeamFilters(view) };
}

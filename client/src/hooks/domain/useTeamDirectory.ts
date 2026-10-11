import { useMemo } from 'react';
import { maxOpenPoints, selectTeamRows, summarizeTeam, toRoleOptions, toTeamRows } from '../../logic/teamLogic';
import type { TeamMember } from '../../types/domain';
import { useTeam } from './useTeam';
import { useTeamView } from './useTeamView';

const NO_MEMBERS: TeamMember[] = [];

/**
 * Everything the Team page shows. The team is fetched once; searching, filtering,
 * sorting and selecting are all derived here from that one response.
 */
export function useTeamDirectory() {
  const resource = useTeam();
  const { view, setOption, toggleMember, closeMember, resetFilters, isFiltered } = useTeamView();
  const members = resource.data ?? NO_MEMBERS;

  const allRows = useMemo(() => toTeamRows(members), [members]);
  const rows = useMemo(() => selectTeamRows(allRows, view), [allRows, view]);
  const roleOptions = useMemo(() => toRoleOptions(members), [members]);
  const pointsScale = useMemo(() => maxOpenPoints(allRows), [allRows]);
  // Looked up in all rows, so the panel stays open when a filter hides its member.
  const selected = useMemo(
    () => allRows.find((row) => row.member.id === view.selectedId) ?? null,
    [allRows, view.selectedId],
  );

  return {
    view,
    setOption,
    resetFilters,
    isFiltered,
    roleOptions,
    rows,
    pointsScale,
    selected,
    toggleMember,
    closeMember,
    summary: resource.isLoading ? 'Loading team…' : summarizeTeam(rows, allRows.length, isFiltered),
    isLoading: resource.isLoading,
    error: resource.data ? null : resource.error,
    refetch: resource.refetch,
  };
}

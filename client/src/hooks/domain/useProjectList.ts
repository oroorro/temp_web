import { useMemo } from 'react';
import { summarizeProjects, toProjectCards } from '../../logic/projectLogic';
import type { Project } from '../../types/domain';
import { useMembers } from './useMembers';
import { useProjectFilters } from './useProjectFilters';
import { useProjects } from './useProjects';
import { useWorkspaceSettings } from './useWorkspaceSettings';

const NO_PROJECTS: Project[] = [];

/** Everything the Projects page shows: filters, the matching project cards and a summary line. */
export function useProjectList() {
  const { filters, query, setFilter, reset, isFiltered } = useProjectFilters();
  const resource = useProjects(query);
  const { membersById } = useMembers();
  const { settings } = useWorkspaceSettings();
  const projects = resource.data ?? NO_PROJECTS;

  const cards = useMemo(
    () => toProjectCards(projects, membersById, settings.dateFormat, Date.now()),
    [projects, membersById, settings.dateFormat],
  );

  return {
    filters,
    sort: query.sort,
    setFilter,
    resetFilters: reset,
    isFiltered,
    cards,
    summary: resource.isLoading ? 'Loading projects…' : summarizeProjects(projects, isFiltered),
    isLoading: resource.isLoading,
    isRefreshing: resource.isRefreshing,
    error: resource.data ? null : resource.error,
    refetch: resource.refetch,
  };
}

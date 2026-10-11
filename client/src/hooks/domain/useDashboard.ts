import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { keys } from '../../api/keys';
import { fetchActivity, fetchDashboardSummary } from '../../api/workspace';
import { buildDashboardScope } from '../../logic/dashboardLogic';
import type { ActivityEntry } from '../../types/domain';
import type { ActionMap } from '../../ui-schema/types';
import { useResource } from '../core/useResource';
import { useWorkspaceSettings } from './useWorkspaceSettings';

const NO_ACTIVITY: ActivityEntry[] = [];

export function useDashboardSummary() {
  return useResource(keys.dashboard(), fetchDashboardSummary);
}

export function useActivity(limit: number) {
  return useResource(keys.activity(limit), () => fetchActivity(limit), { keepPrevious: true });
}

/** Data (`scope`) and handlers (`actions`) for rendering `dashboard.page.json`. */
export function useDashboard() {
  const { settings } = useWorkspaceSettings();
  const summary = useDashboardSummary();
  const activity = useActivity(settings.activityFeedSize);
  const navigate = useNavigate();

  const activityEntries = activity.data ?? NO_ACTIVITY;
  const scope = useMemo(
    () => (summary.data ? buildDashboardScope(summary.data, activityEntries, settings, Date.now()) : null),
    [summary.data, activityEntries, settings],
  );

  const actions = useMemo<ActionMap>(
    () => ({
      navigate: (to) => {
        if (typeof to === 'string') void navigate(to);
      },
    }),
    [navigate],
  );

  const { refetch: refetchSummary } = summary;
  const { refetch: refetchActivity } = activity;
  const refetch = useCallback(() => {
    refetchSummary();
    refetchActivity();
  }, [refetchSummary, refetchActivity]);

  return {
    scope,
    actions,
    isLoading: summary.isLoading,
    isRefreshing: summary.isRefreshing || activity.isRefreshing,
    error: scope ? null : summary.error,
    refetch,
  };
}

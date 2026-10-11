import type { ActivityEntry, DashboardSummary, WorkspaceSettings } from '../types/domain';
import { describeDue, formatRelative, pluralize } from './formatters';
import { PROJECT_STATUS_META, TASK_STATUS_META } from './labels';

const HEALTHY_COMPLETION_RATE = 50;

/**
 * Shapes the API data into the scope that `dashboard.page.json` binds against.
 * Every `$bind` path and `{{template}}` in that declaration resolves into this object.
 */
export function buildDashboardScope(
  summary: DashboardSummary,
  activity: ActivityEntry[],
  settings: WorkspaceSettings,
  now: number,
) {
  const { totals } = summary;
  const isHealthy = totals.completionRate >= HEALTHY_COMPLETION_RATE;

  return {
    totals,
    completion: {
      label: isHealthy ? 'On track' : 'Behind',
      tone: isHealthy ? 'success' : 'warning',
    },
    overdue: {
      badge: totals.overdueProjects > 0 ? 'Needs attention' : undefined,
      hint: totals.overdueProjects > 0 ? 'past their due date' : 'everything is on schedule',
    },
    tasksByStatus: summary.tasksByStatus.map((row) => ({
      status: row.status,
      label: TASK_STATUS_META[row.status].label,
      tone: TASK_STATUS_META[row.status].tone,
      count: row.count,
    })),
    workload: summary.workload.map((row) => ({
      id: row.memberId,
      name: row.name,
      openTasks: row.openTasks,
      hint: pluralize(row.openTasks, 'open task'),
    })),
    maxWorkload: Math.max(1, ...summary.workload.map((row) => row.openTasks)),
    upcoming: summary.upcoming.map((project) => {
      const due = describeDue(project.dueDate, settings.dateFormat, now);
      return {
        id: project.id,
        name: project.name,
        detail: `${PROJECT_STATUS_META[project.status].label} · ${project.progress}% complete`,
        dueLabel: due?.label,
        dueTone: due?.tone,
      };
    }),
    activity: activity.map((entry) => ({
      id: entry.id,
      message: entry.message,
      when: formatRelative(entry.createdAt, now),
    })),
  };
}

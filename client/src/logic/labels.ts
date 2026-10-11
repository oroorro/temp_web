import type { ProjectSort, ProjectStatus, TaskPriority, TaskStatus } from '../types/domain';
import type { Option, TeamLayout, TeamSort, Tone } from '../types/ui';

interface Meta {
  label: string;
  tone: Tone;
}

export const PROJECT_STATUSES: ProjectStatus[] = ['planning', 'active', 'paused', 'done'];

export const PROJECT_STATUS_META: Record<ProjectStatus, Meta> = {
  planning: { label: 'Planning', tone: 'info' },
  active: { label: 'Active', tone: 'success' },
  paused: { label: 'Paused', tone: 'warning' },
  done: { label: 'Done', tone: 'neutral' },
};

/** Board column order, left to right. */
export const TASK_STATUSES: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];

export const TASK_STATUS_META: Record<TaskStatus, Meta> = {
  todo: { label: 'To do', tone: 'neutral' },
  in_progress: { label: 'In progress', tone: 'info' },
  review: { label: 'In review', tone: 'warning' },
  done: { label: 'Done', tone: 'success' },
};

export const TASK_PRIORITIES: TaskPriority[] = ['high', 'medium', 'low'];

export const PRIORITY_META: Record<TaskPriority, Meta & { rank: number }> = {
  high: { label: 'High', tone: 'danger', rank: 3 },
  medium: { label: 'Medium', tone: 'warning', rank: 2 },
  low: { label: 'Low', tone: 'neutral', rank: 1 },
};

export const PROJECT_SORT_OPTIONS: Option<ProjectSort>[] = [
  { value: 'updated', label: 'Recently updated' },
  { value: 'name', label: 'Name' },
  { value: 'due', label: 'Due date' },
  { value: 'progress', label: 'Progress' },
];

export const PROJECT_STATUS_OPTIONS: Option<ProjectStatus>[] = PROJECT_STATUSES.map((status) => ({
  value: status,
  label: PROJECT_STATUS_META[status].label,
}));

export const TEAM_SORT_OPTIONS: Option<TeamSort>[] = [
  { value: 'name', label: 'Name' },
  { value: 'open', label: 'Open tasks' },
  { value: 'points', label: 'Open points' },
  { value: 'completion', label: 'Completion' },
];

export const TEAM_LAYOUT_OPTIONS: Option<TeamLayout>[] = [
  { value: 'cards', label: 'Cards' },
  { value: 'table', label: 'Table' },
];

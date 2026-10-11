import type { Task, TaskPatch, TaskStatus } from '../types/domain';
import type { TaskFilters } from '../types/ui';
import { PRIORITY_META, TASK_STATUSES, TASK_STATUS_META } from './labels';

export const MAX_TASK_TITLE_LENGTH = 120;

export function hasActiveTaskFilters(filters: TaskFilters): boolean {
  return filters.search.trim() !== '' || filters.assigneeId !== 'all' || filters.priority !== 'all';
}

function matchesAssignee(task: Task, assigneeId: string): boolean {
  if (assigneeId === 'all') return true;
  if (assigneeId === 'unassigned') return task.assigneeId === null;
  return task.assigneeId === assigneeId;
}

export function matchesTaskFilters(task: Task, filters: TaskFilters): boolean {
  const needle = filters.search.trim().toLowerCase();
  const matchesSearch =
    needle === '' || task.title.toLowerCase().includes(needle) || task.description.toLowerCase().includes(needle);
  const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
  return matchesSearch && matchesPriority && matchesAssignee(task, filters.assigneeId);
}

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  return tasks.filter((task) => matchesTaskFilters(task, filters));
}

/** Highest priority first; ties go to the most recently touched task. */
export function sortTasks<T extends Pick<Task, 'priority' | 'updatedAt'>>(tasks: T[]): T[] {
  return [...tasks].sort(
    (a, b) =>
      PRIORITY_META[b.priority].rank - PRIORITY_META[a.priority].rank || b.updatedAt.localeCompare(a.updatedAt),
  );
}

export function adjacentStatuses(status: TaskStatus): { previous: TaskStatus | null; next: TaskStatus | null } {
  const index = TASK_STATUSES.indexOf(status);
  return {
    previous: TASK_STATUSES[index - 1] ?? null,
    next: TASK_STATUSES[index + 1] ?? null,
  };
}

export function moveLabel(status: TaskStatus | null): string {
  return status ? `Move to ${TASK_STATUS_META[status].label}` : 'Cannot move further';
}

export function applyTaskPatch(tasks: Task[], taskId: string, patch: TaskPatch): Task[] {
  return tasks.map((task) => (task.id === taskId ? { ...task, ...patch } : task));
}

export function removeTask(tasks: Task[], taskId: string): Task[] {
  return tasks.filter((task) => task.id !== taskId);
}

/** Returns the cleaned title, or `null` when it cannot be used. */
export function normalizeTaskTitle(raw: string): string | null {
  const title = raw.trim().replace(/\s+/g, ' ');
  return title === '' || title.length > MAX_TASK_TITLE_LENGTH ? null : title;
}

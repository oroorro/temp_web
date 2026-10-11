import type { Member, Task, TaskStatus, WorkspaceSettings } from '../types/domain';
import type { TaskFilters, Tone } from '../types/ui';
import { TASK_STATUSES, TASK_STATUS_META } from './labels';
import type { MembersById } from './memberLogic';
import { adjacentStatuses, filterTasks, sortTasks } from './taskLogic';

export interface BoardTask {
  task: Task;
  assignee: Member | null;
  previousStatus: TaskStatus | null;
  nextStatus: TaskStatus | null;
}

export interface BoardColumn {
  status: TaskStatus;
  label: string;
  tone: Tone;
  /** Tasks left after filtering, already sorted. */
  tasks: BoardTask[];
  /** Tasks in this status before filtering. */
  totalCount: number;
  points: number;
  overLimit: boolean;
}

export interface BoardModel {
  columns: BoardColumn[];
  visibleCount: number;
  totalCount: number;
  /** Completed tasks left out because the Done column is switched off in Settings. */
  hiddenDoneCount: number;
}

export interface BoardInput {
  tasks: Task[];
  filters: TaskFilters;
  membersById: MembersById;
  settings: Pick<WorkspaceSettings, 'showCompletedTasks' | 'wipLimit'>;
}

function toBoardTask(task: Task, membersById: MembersById): BoardTask {
  const { previous, next } = adjacentStatuses(task.status);
  return {
    task,
    assignee: task.assigneeId ? (membersById[task.assigneeId] ?? null) : null,
    previousStatus: previous,
    nextStatus: next,
  };
}

function isOverLimit(status: TaskStatus, count: number, wipLimit: number): boolean {
  return status === 'in_progress' && wipLimit > 0 && count > wipLimit;
}

/** Turns the flat task list into the columns the board renders. */
export function buildBoard({ tasks, filters, membersById, settings }: BoardInput): BoardModel {
  const statuses = settings.showCompletedTasks ? TASK_STATUSES : TASK_STATUSES.filter((status) => status !== 'done');
  const matching = sortTasks(filterTasks(tasks, filters));

  const columns = statuses.map((status): BoardColumn => {
    const columnTasks = matching.filter((task) => task.status === status);
    const totalCount = tasks.filter((task) => task.status === status).length;
    return {
      status,
      label: TASK_STATUS_META[status].label,
      tone: TASK_STATUS_META[status].tone,
      tasks: columnTasks.map((task) => toBoardTask(task, membersById)),
      totalCount,
      points: columnTasks.reduce((sum, task) => sum + task.estimate, 0),
      overLimit: isOverLimit(status, totalCount, settings.wipLimit),
    };
  });

  return {
    columns,
    visibleCount: columns.reduce((sum, column) => sum + column.tasks.length, 0),
    totalCount: columns.reduce((sum, column) => sum + column.totalCount, 0),
    hiddenDoneCount: settings.showCompletedTasks ? 0 : tasks.filter((task) => task.status === 'done').length,
  };
}

export function describeBoardCount(board: BoardModel, isFiltered: boolean): string {
  const shown = isFiltered ? `${board.visibleCount} of ${board.totalCount} tasks` : `${board.totalCount} tasks`;
  return board.hiddenDoneCount > 0 ? `${shown} · ${board.hiddenDoneCount} completed hidden` : shown;
}

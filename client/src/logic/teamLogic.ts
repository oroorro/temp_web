import type { TeamMember, TeamTask } from '../types/domain';
import type { Option, TeamSort, TeamView } from '../types/ui';
import { pluralize } from './formatters';
import { sortTasks } from './taskLogic';

export type TaskTab = 'open' | 'done';

/** A member plus the numbers derived from their tasks. */
export interface TeamRow {
  member: TeamMember;
  openTasks: number;
  doneTasks: number;
  /** Sum of the estimates of the open tasks. */
  openPoints: number;
  /** Share of this member's tasks that are done, 0–100. */
  completion: number;
}

export const INITIAL_TEAM_VIEW: TeamView = {
  search: '',
  role: 'all',
  sort: 'name',
  layout: 'cards',
  selectedId: null,
};

export function toTeamRows(members: TeamMember[]): TeamRow[] {
  return members.map((member) => {
    const open = member.tasks.filter((task) => task.status !== 'done');
    const doneTasks = member.tasks.length - open.length;
    return {
      member,
      openTasks: open.length,
      doneTasks,
      openPoints: open.reduce((sum, task) => sum + task.estimate, 0),
      completion: member.tasks.length === 0 ? 0 : Math.round((doneTasks / member.tasks.length) * 100),
    };
  });
}

export function toRoleOptions(members: TeamMember[]): Option[] {
  const roles = [...new Set(members.map((member) => member.role))].sort((a, b) => a.localeCompare(b));
  return [{ value: 'all', label: 'All roles' }, ...roles.map((role) => ({ value: role, label: role }))];
}

export function hasActiveTeamFilters(view: TeamView): boolean {
  return view.search.trim() !== '' || view.role !== 'all';
}

const comparators: Record<TeamSort, (a: TeamRow, b: TeamRow) => number> = {
  name: (a, b) => a.member.name.localeCompare(b.member.name),
  open: (a, b) => b.openTasks - a.openTasks,
  points: (a, b) => b.openPoints - a.openPoints,
  completion: (a, b) => b.completion - a.completion,
};

/** Applies the search, the role filter and the sort order; ties are ordered by name. */
export function selectTeamRows(rows: TeamRow[], view: TeamView): TeamRow[] {
  const needle = view.search.trim().toLowerCase();
  return rows
    .filter((row) => view.role === 'all' || row.member.role === view.role)
    .filter(
      (row) =>
        needle === '' ||
        row.member.name.toLowerCase().includes(needle) ||
        row.member.role.toLowerCase().includes(needle),
    )
    .sort((a, b) => comparators[view.sort](a, b) || comparators.name(a, b));
}

/** The heaviest workload on the team; workload bars are drawn relative to it. */
export function maxOpenPoints(rows: TeamRow[]): number {
  return rows.reduce((max, row) => Math.max(max, row.openPoints), 0);
}

export function summarizeTeam(visible: TeamRow[], total: number, isFiltered: boolean): string {
  if (total === 0) return 'No members yet';
  const members = pluralize(total, 'member');
  const openTasks = visible.reduce((sum, row) => sum + row.openTasks, 0);
  return `${isFiltered ? `${visible.length} of ${members}` : members} · ${pluralize(openTasks, 'open task')}`;
}

export function describeWorkload(row: TeamRow): string {
  return row.openTasks === 0 ? 'No open tasks' : pluralize(row.openTasks, 'open task');
}

/** Selecting the member that is already selected closes the detail panel. */
export function toggleSelection(view: TeamView, memberId: string): TeamView {
  return { ...view, selectedId: view.selectedId === memberId ? null : memberId };
}

export function clearSelection(view: TeamView): TeamView {
  return { ...view, selectedId: null };
}

/** Clears what narrows the list but keeps the sort order, the layout and the open member. */
export function clearTeamFilters(view: TeamView): TeamView {
  return { ...view, search: '', role: 'all' };
}

export function toTaskTabOptions(row: TeamRow): Option<TaskTab>[] {
  return [
    { value: 'open', label: `Open (${row.openTasks})` },
    { value: 'done', label: `Done (${row.doneTasks})` },
  ];
}

export function tasksInTab(tasks: TeamTask[], tab: TaskTab): TeamTask[] {
  return sortTasks(tasks.filter((task) => (task.status === 'done') === (tab === 'done')));
}

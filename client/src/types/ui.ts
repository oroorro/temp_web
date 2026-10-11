import type { ProjectSort, ProjectStatus, TaskPriority } from './domain';

export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'accent';

export type IconName =
  | 'dashboard'
  | 'folder'
  | 'users'
  | 'settings'
  | 'sun'
  | 'moon'
  | 'monitor'
  | 'plus'
  | 'arrow-left'
  | 'arrow-right'
  | 'trash'
  | 'menu'
  | 'search'
  | 'refresh'
  | 'close';

export interface Option<T extends string = string> {
  value: T;
  label: string;
}

export interface ProjectFilters {
  search: string;
  status: ProjectStatus | 'all';
  /** `null` means "use the workspace default". */
  sort: ProjectSort | null;
}

export type TeamSort = 'name' | 'open' | 'points' | 'completion';
export type TeamLayout = 'cards' | 'table';

// Declared as a type alias (not an interface) so `keyof` works with the generic option setter.
export type TeamView = {
  search: string;
  /** A role name or `'all'`. */
  role: string;
  sort: TeamSort;
  layout: TeamLayout;
  /** The member whose detail panel is open. */
  selectedId: string | null;
};

export interface TaskFilters {
  search: string;
  /** A member id, `'all'` or `'unassigned'`. */
  assigneeId: string;
  priority: TaskPriority | 'all';
}

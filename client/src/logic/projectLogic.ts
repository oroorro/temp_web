import type { DateFormat, Member, NewProjectInput, Project, ProjectSort, ProjectStatus } from '../types/domain';
import type { ProjectFilters } from '../types/ui';
import type { FormErrors } from './formLogic';
import { describeDue, pluralize } from './formatters';
import type { DueInfo } from './formatters';
import { resolveMembers } from './memberLogic';
import type { MembersById } from './memberLogic';

/** Query string parameters understood by `GET /api/projects`. */
export type ProjectQuery = {
  sort: ProjectSort;
  status?: ProjectStatus;
  q?: string;
};

export interface ProjectCardModel {
  project: Project;
  members: Member[];
  due: DueInfo | null;
  taskSummary: string;
}

// Form values of the "New project" dialog; everything is a string until submit.
export type ProjectDraft = {
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId: string;
  dueDate: string;
  tags: string;
};

export const EMPTY_PROJECT_DRAFT: ProjectDraft = {
  name: '',
  description: '',
  status: 'planning',
  ownerId: '',
  dueDate: '',
  tags: '',
};

const MAX_NAME_LENGTH = 80;
const MAX_DESCRIPTION_LENGTH = 500;

export function hasActiveProjectFilters(filters: ProjectFilters): boolean {
  return filters.search.trim() !== '' || filters.status !== 'all';
}

/** Combines the UI filters with the (debounced) search text and the workspace default sort. */
export function resolveProjectQuery(filters: ProjectFilters, search: string, defaultSort: ProjectSort): ProjectQuery {
  const query: ProjectQuery = { sort: filters.sort ?? defaultSort };
  if (filters.status !== 'all') query.status = filters.status;
  if (search.trim() !== '') query.q = search.trim();
  return query;
}

export function toQueryKey(query: ProjectQuery): string {
  return [query.sort, query.status ?? 'all', query.q ?? ''].join('|');
}

export function summarizeProjects(projects: Project[], isFiltered: boolean): string {
  if (projects.length === 0) return isFiltered ? 'No projects match the filters' : 'No projects yet';
  const active = projects.filter((project) => project.status === 'active').length;
  const count = pluralize(projects.length, 'project');
  return `${isFiltered ? `${count} found` : count} · ${active} active`;
}

export function describeTaskCounts(project: Project): string {
  const { done, total } = project.taskCounts;
  return total === 0 ? 'No tasks yet' : `${done} of ${pluralize(total, 'task')} done`;
}

export function toProjectCards(
  projects: Project[],
  membersById: MembersById,
  dateFormat: DateFormat,
  now: number,
): ProjectCardModel[] {
  return projects.map((project) => ({
    project,
    members: resolveMembers(project.memberIds, membersById),
    due: describeDue(project.dueDate, dateFormat, now, project.status === 'done'),
    taskSummary: describeTaskCounts(project),
  }));
}

export function parseTags(raw: string): string[] {
  const tags = raw
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
  return [...new Set(tags)];
}

export function validateProjectDraft(draft: ProjectDraft): FormErrors {
  const errors: FormErrors = {};
  const name = draft.name.trim();

  if (name === '') errors.name = 'Give the project a name';
  else if (name.length > MAX_NAME_LENGTH) errors.name = `Keep the name under ${MAX_NAME_LENGTH} characters`;

  if (draft.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Keep the description under ${MAX_DESCRIPTION_LENGTH} characters`;
  }
  if (draft.ownerId === '') errors.ownerId = 'Choose an owner';

  return errors;
}

export function toNewProjectInput(draft: ProjectDraft): NewProjectInput {
  return {
    name: draft.name.trim(),
    description: draft.description.trim(),
    status: draft.status,
    ownerId: draft.ownerId,
    dueDate: draft.dueDate === '' ? null : draft.dueDate,
    tags: parseTags(draft.tags),
  };
}

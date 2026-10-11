import { db } from '../data/db.js';
import { notFound } from '../utils/httpError.js';
import { createId } from '../utils/id.js';
import { recordActivity } from './activity.service.js';
import { assertMember } from './members.service.js';

function countTasks(projectId) {
  const counts = { todo: 0, in_progress: 0, review: 0, done: 0, total: 0 };
  for (const task of db.tasks) {
    if (task.projectId !== projectId) continue;
    counts[task.status] += 1;
    counts.total += 1;
  }
  return counts;
}

/** Adds the derived task counts and completion percentage to a project. */
export function withStats(project) {
  const taskCounts = countTasks(project.id);
  const progress = taskCounts.total === 0 ? 0 : Math.round((taskCounts.done / taskCounts.total) * 100);
  return { ...project, taskCounts, progress };
}

const comparators = {
  updated: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
  name: (a, b) => a.name.localeCompare(b.name),
  // Projects without a due date sort last.
  due: (a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999'),
  progress: (a, b) => b.progress - a.progress,
};

export function listProjects({ status, q, sort = 'updated' } = {}) {
  const needle = q?.toLowerCase();
  return db.projects
    .filter((project) => !status || project.status === status)
    .filter(
      (project) =>
        !needle ||
        [project.name, project.description, ...project.tags].some((text) => text.toLowerCase().includes(needle)),
    )
    .map(withStats)
    .sort(comparators[sort]);
}

export function findProject(id) {
  const project = db.projects.find((candidate) => candidate.id === id);
  if (!project) throw notFound('Project');
  return project;
}

export function getProject(id) {
  return withStats(findProject(id));
}

export function touchProject(id) {
  findProject(id).updatedAt = new Date().toISOString();
}

export function createProject(input) {
  assertMember(input.ownerId, 'ownerId');
  const memberIds = [...new Set([input.ownerId, ...(input.memberIds ?? [])])];
  memberIds.forEach((memberId) => assertMember(memberId, 'memberIds'));

  const now = new Date().toISOString();
  const project = {
    id: createId('p'),
    name: input.name,
    description: input.description ?? '',
    status: input.status ?? 'planning',
    ownerId: input.ownerId,
    memberIds,
    tags: input.tags ?? [],
    dueDate: input.dueDate ?? null,
    createdAt: now,
    updatedAt: now,
  };

  db.projects.push(project);
  recordActivity('project.created', `Project “${project.name}” created`, project.id);
  return withStats(project);
}

export function updateProject(id, patch) {
  const project = findProject(id);
  if (patch.ownerId !== undefined) assertMember(patch.ownerId, 'ownerId');
  patch.memberIds?.forEach((memberId) => assertMember(memberId, 'memberIds'));

  const previousStatus = project.status;
  Object.assign(project, patch, { updatedAt: new Date().toISOString() });
  if (!project.memberIds.includes(project.ownerId)) project.memberIds.unshift(project.ownerId);

  const message =
    patch.status && patch.status !== previousStatus
      ? `Project “${project.name}” marked as ${project.status}`
      : `Project “${project.name}” updated`;
  recordActivity('project.updated', message, project.id);
  return withStats(project);
}

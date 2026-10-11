import { TASK_STATUS_LABELS } from '../constants.js';
import { db } from '../data/db.js';
import { notFound } from '../utils/httpError.js';
import { createId } from '../utils/id.js';
import { recordActivity } from './activity.service.js';
import { assertMember } from './members.service.js';
import { findProject, touchProject } from './projects.service.js';

function findTask(id) {
  const task = db.tasks.find((candidate) => candidate.id === id);
  if (!task) throw notFound('Task');
  return task;
}

export function listTasks(projectId) {
  findProject(projectId);
  return db.tasks.filter((task) => task.projectId === projectId);
}

export function createTask(projectId, input) {
  const project = findProject(projectId);
  if (input.assigneeId) assertMember(input.assigneeId, 'assigneeId');

  const now = new Date().toISOString();
  const task = {
    id: createId('t'),
    projectId,
    title: input.title,
    description: input.description ?? '',
    status: input.status ?? 'todo',
    priority: input.priority ?? 'medium',
    assigneeId: input.assigneeId ?? null,
    estimate: input.estimate ?? 1,
    createdAt: now,
    updatedAt: now,
  };

  db.tasks.push(task);
  touchProject(projectId);
  recordActivity('task.created', `“${task.title}” added to ${project.name}`, projectId);
  return task;
}

export function updateTask(id, patch) {
  const task = findTask(id);
  if (patch.assigneeId) assertMember(patch.assigneeId, 'assigneeId');

  const previousStatus = task.status;
  Object.assign(task, patch, { updatedAt: new Date().toISOString() });
  touchProject(task.projectId);

  if (task.status !== previousStatus) {
    recordActivity('task.moved', `“${task.title}” moved to ${TASK_STATUS_LABELS[task.status]}`, task.projectId);
  }
  return task;
}

export function deleteTask(id) {
  const task = findTask(id);
  db.tasks.splice(db.tasks.indexOf(task), 1);
  touchProject(task.projectId);
  recordActivity('task.deleted', `“${task.title}” was deleted`, task.projectId);
}

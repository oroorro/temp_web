import type { NewTaskInput, Task, TaskPatch } from '../types/domain';
import { request } from './client';

export const fetchProjectTasks = (projectId: string) =>
  request<Task[]>(`/projects/${encodeURIComponent(projectId)}/tasks`);

export const createTask = (projectId: string, input: NewTaskInput) =>
  request<Task>(`/projects/${encodeURIComponent(projectId)}/tasks`, { method: 'POST', body: input });

export const updateTask = (taskId: string, patch: TaskPatch) =>
  request<Task>(`/tasks/${encodeURIComponent(taskId)}`, { method: 'PATCH', body: patch });

export const deleteTask = (taskId: string) =>
  request<void>(`/tasks/${encodeURIComponent(taskId)}`, { method: 'DELETE' });

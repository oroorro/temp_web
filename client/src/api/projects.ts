import type { NewProjectInput, Project, ProjectPatch } from '../types/domain';
import { request } from './client';
import type { QueryParams } from './client';

export const fetchProjects = (query: QueryParams) => request<Project[]>('/projects', { query });

export const fetchProject = (projectId: string) => request<Project>(`/projects/${encodeURIComponent(projectId)}`);

export const createProject = (input: NewProjectInput) =>
  request<Project>('/projects', { method: 'POST', body: input });

export const updateProject = (projectId: string, patch: ProjectPatch) =>
  request<Project>(`/projects/${encodeURIComponent(projectId)}`, { method: 'PATCH', body: patch });

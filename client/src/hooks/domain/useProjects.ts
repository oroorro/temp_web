import { keys } from '../../api/keys';
import { fetchProject, fetchProjects } from '../../api/projects';
import { fetchProjectTasks } from '../../api/tasks';
import { toQueryKey } from '../../logic/projectLogic';
import type { ProjectQuery } from '../../logic/projectLogic';
import { useResource } from '../core/useResource';

/** The project list for one query; the previous list stays visible while a new query loads. */
export function useProjects(query: ProjectQuery) {
  return useResource(keys.projects(toQueryKey(query)), () => fetchProjects(query), { keepPrevious: true });
}

export function useProject(projectId: string) {
  return useResource(keys.project(projectId), () => fetchProject(projectId));
}

export function useProjectTasks(projectId: string) {
  return useResource(keys.projectTasks(projectId), () => fetchProjectTasks(projectId));
}

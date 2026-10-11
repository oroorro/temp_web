import { useCallback, useEffect, useMemo } from 'react';
import { invalidation } from '../../api/keys';
import { updateProject } from '../../api/projects';
import { buildBoard, describeBoardCount } from '../../logic/boardLogic';
import { describeDue } from '../../logic/formatters';
import { resolveMembers } from '../../logic/memberLogic';
import { describeTaskCounts } from '../../logic/projectLogic';
import type { ProjectStatus, Task } from '../../types/domain';
import { useMutation } from '../core/useMutation';
import { useMembers } from './useMembers';
import { useProject, useProjectTasks } from './useProjects';
import { useTaskFilters } from './useTaskFilters';
import { useTaskMutations } from './useTaskMutations';
import { useWorkspaceSettings } from './useWorkspaceSettings';

const NO_TASKS: Task[] = [];

/** Everything the project page needs: the project, its team, the filtered board and the task actions. */
export function useProjectBoard(projectId: string) {
  const projectResource = useProject(projectId);
  const tasksResource = useProjectTasks(projectId);
  const { membersById } = useMembers();
  const { settings } = useWorkspaceSettings();
  const taskFilters = useTaskFilters();
  const actions = useTaskMutations(projectId);

  const { mutate: patchProject, isPending: isUpdatingStatus } = useMutation(
    (status: ProjectStatus) => updateProject(projectId, { status }),
    { invalidates: invalidation.projectChanged(projectId), successMessage: 'Project status updated' },
  );
  const setStatus = useCallback((status: ProjectStatus) => void patchProject(status), [patchProject]);

  // Board filters are global state; start every project with a clean slate.
  const { reset: resetFilters } = taskFilters;
  useEffect(() => resetFilters, [projectId, resetFilters]);

  const project = projectResource.data;
  const tasks = tasksResource.data ?? NO_TASKS;

  const board = useMemo(
    () => buildBoard({ tasks, filters: taskFilters.applied, membersById, settings }),
    [tasks, taskFilters.applied, membersById, settings],
  );

  const overview = useMemo(() => {
    if (!project) return null;
    return {
      team: resolveMembers(project.memberIds, membersById),
      due: describeDue(project.dueDate, settings.dateFormat, Date.now(), project.status === 'done'),
      taskSummary: describeTaskCounts(project),
    };
  }, [project, membersById, settings.dateFormat]);

  const { refetch: refetchProject } = projectResource;
  const { refetch: refetchTasks } = tasksResource;
  const refetch = useCallback(() => {
    refetchProject();
    refetchTasks();
  }, [refetchProject, refetchTasks]);

  const hasData = project !== undefined && tasksResource.data !== undefined;

  return {
    project,
    overview,
    board,
    boardCount: describeBoardCount(board, taskFilters.isFiltered),
    filters: taskFilters,
    actions,
    setStatus,
    isUpdatingStatus,
    isLoading: projectResource.isLoading || tasksResource.isLoading,
    error: hasData ? null : (projectResource.error ?? tasksResource.error),
    refetch,
  };
}

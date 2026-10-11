import { useMemo } from 'react';
import { invalidation, keys } from '../../api/keys';
import { createTask, deleteTask, updateTask } from '../../api/tasks';
import { applyTaskPatch, removeTask } from '../../logic/taskLogic';
import { optimisticUpdate } from '../../store/resourceStore';
import type { NewTaskInput, Task, TaskPatch, TaskStatus } from '../../types/domain';
import { useMutation } from '../core/useMutation';

export interface TaskActions {
  addTask: (input: NewTaskInput) => void;
  moveTask: (task: Task, status: TaskStatus) => void;
  deleteTask: (task: Task) => void;
}

/**
 * Write operations for one project's tasks. Moves and deletes show up on the
 * board immediately and are rolled back if the server rejects them.
 */
export function useTaskMutations(projectId: string): TaskActions {
  const tasksKey = keys.projectTasks(projectId);
  const invalidates = useMemo(() => invalidation.taskChanged(projectId), [projectId]);

  const { mutate: create } = useMutation((input: NewTaskInput) => createTask(projectId, input), {
    invalidates,
    successMessage: 'Task added',
  });

  const { mutate: update } = useMutation(
    ({ taskId, patch }: { taskId: string; patch: TaskPatch }) => updateTask(taskId, patch),
    {
      invalidates,
      onMutate: ({ taskId, patch }) => optimisticUpdate<Task[]>(tasksKey, (tasks) => applyTaskPatch(tasks, taskId, patch)),
      errorMessage: 'Could not update the task',
    },
  );

  const { mutate: remove } = useMutation((taskId: string) => deleteTask(taskId), {
    invalidates,
    onMutate: (taskId) => optimisticUpdate<Task[]>(tasksKey, (tasks) => removeTask(tasks, taskId)),
    successMessage: 'Task deleted',
  });

  return useMemo(
    () => ({
      addTask: (input) => void create(input),
      moveTask: (task, status) => void update({ taskId: task.id, patch: { status } }),
      deleteTask: (task) => void remove(task.id),
    }),
    [create, update, remove],
  );
}

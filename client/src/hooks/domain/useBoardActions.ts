import { useContext } from 'react';
import { BoardActionsContext } from '../../components/tasks/BoardActionsContext';
import type { TaskActions } from './useTaskMutations';

export function useBoardActions(): TaskActions {
  const actions = useContext(BoardActionsContext);
  if (!actions) throw new Error('Board components must be rendered inside a <TaskBoard>.');
  return actions;
}

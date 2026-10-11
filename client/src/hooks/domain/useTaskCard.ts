import { useCallback, useState } from 'react';
import type { BoardTask } from '../../logic/boardLogic';
import { moveLabel } from '../../logic/taskLogic';
import { useBoardActions } from './useBoardActions';

/** Handlers for the buttons on one task card. Deleting takes two clicks: ask, then confirm. */
export function useTaskCard({ task, previousStatus, nextStatus }: BoardTask) {
  const { moveTask, deleteTask } = useBoardActions();
  const [isConfirmingDelete, setConfirmingDelete] = useState(false);

  const moveBack = useCallback(() => {
    if (previousStatus) moveTask(task, previousStatus);
  }, [moveTask, task, previousStatus]);

  const moveForward = useCallback(() => {
    if (nextStatus) moveTask(task, nextStatus);
  }, [moveTask, task, nextStatus]);

  const requestDelete = useCallback(() => {
    if (isConfirmingDelete) deleteTask(task);
    else setConfirmingDelete(true);
  }, [isConfirmingDelete, deleteTask, task]);

  const cancelDelete = useCallback(() => setConfirmingDelete(false), []);

  return {
    moveBack,
    moveForward,
    backLabel: moveLabel(previousStatus),
    forwardLabel: moveLabel(nextStatus),
    canMoveBack: previousStatus !== null,
    canMoveForward: nextStatus !== null,
    requestDelete,
    cancelDelete,
    isConfirmingDelete,
  };
}

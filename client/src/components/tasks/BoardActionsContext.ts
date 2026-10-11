import { createContext } from 'react';
import type { TaskActions } from '../../hooks/domain/useTaskMutations';

/** Lets cards deep inside the board reach the task actions without passing them through every level. */
export const BoardActionsContext = createContext<TaskActions | null>(null);

import type { TaskActions } from '../../hooks/domain/useTaskMutations';
import type { BoardModel } from '../../logic/boardLogic';
import { BoardActionsContext } from './BoardActionsContext';
import { TaskColumn } from './TaskColumn';

interface TaskBoardProps {
  board: BoardModel;
  actions: TaskActions;
}

export function TaskBoard({ board, actions }: TaskBoardProps) {
  return (
    <BoardActionsContext.Provider value={actions}>
      <div className="board">
        {board.columns.map((column) => (
          <TaskColumn key={column.status} column={column} />
        ))}
      </div>
    </BoardActionsContext.Provider>
  );
}

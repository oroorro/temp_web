import type { BoardColumn } from '../../logic/boardLogic';
import { QuickAddTask } from './QuickAddTask';
import { TaskColumnHeader } from './TaskColumnHeader';
import { TaskList } from './TaskList';

interface TaskColumnProps {
  column: BoardColumn;
}

export function TaskColumn({ column }: TaskColumnProps) {
  return (
    <section className="board-column" aria-label={column.label}>
      <TaskColumnHeader column={column} />
      <TaskList items={column.tasks} isColumnEmpty={column.totalCount === 0} />
      <QuickAddTask status={column.status} columnLabel={column.label} />
    </section>
  );
}

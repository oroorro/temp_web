import type { BoardTask } from '../../logic/boardLogic';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  items: BoardTask[];
  /** True when the column has no tasks at all, as opposed to none matching the filters. */
  isColumnEmpty: boolean;
}

export function TaskList({ items, isColumnEmpty }: TaskListProps) {
  if (items.length === 0) {
    return <p className="board-column__empty">{isColumnEmpty ? 'Nothing here yet' : 'No tasks match the filters'}</p>;
  }

  return (
    <ul className="task-list">
      {items.map((item) => (
        <li key={item.task.id}>
          <TaskCard item={item} />
        </li>
      ))}
    </ul>
  );
}

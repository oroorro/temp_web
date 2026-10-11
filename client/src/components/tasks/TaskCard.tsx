import type { BoardTask } from '../../logic/boardLogic';
import { TaskCardFooter } from './TaskCardFooter';
import { TaskCardHeader } from './TaskCardHeader';

interface TaskCardProps {
  item: BoardTask;
}

export function TaskCard({ item }: TaskCardProps) {
  const { task } = item;
  return (
    <article className="task-card">
      <TaskCardHeader title={task.title} priority={task.priority} />
      {task.description && <p className="task-card__description">{task.description}</p>}
      <TaskCardFooter item={item} />
    </article>
  );
}

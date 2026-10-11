import { PRIORITY_META } from '../../logic/labels';
import type { TaskPriority } from '../../types/domain';
import { Badge } from '../common/Badge';

interface TaskCardHeaderProps {
  title: string;
  priority: TaskPriority;
}

export function TaskCardHeader({ title, priority }: TaskCardHeaderProps) {
  const { label, tone } = PRIORITY_META[priority];
  return (
    <header className="task-card__header">
      <h3 className="task-card__title">{title}</h3>
      <Badge label={label} tone={tone} />
    </header>
  );
}

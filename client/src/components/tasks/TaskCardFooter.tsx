import { useTaskCard } from '../../hooks/domain/useTaskCard';
import type { BoardTask } from '../../logic/boardLogic';
import { pluralize } from '../../logic/formatters';
import { Button } from '../common/Button';
import { IconButton } from '../common/IconButton';
import { AssigneeBadge } from './AssigneeBadge';

interface TaskCardFooterProps {
  item: BoardTask;
}

export function TaskCardFooter({ item }: TaskCardFooterProps) {
  const card = useTaskCard(item);

  return (
    <footer className="task-card__footer">
      <div className="task-card__meta">
        <AssigneeBadge member={item.assignee} />
        <span className="task-card__estimate">{pluralize(item.task.estimate, 'pt')}</span>
      </div>

      {card.isConfirmingDelete ? (
        <div className="task-card__actions">
          <Button label="Keep" variant="ghost" size="sm" onClick={card.cancelDelete} />
          <Button label="Delete" variant="danger" size="sm" onClick={card.requestDelete} />
        </div>
      ) : (
        <div className="task-card__actions">
          <IconButton icon="arrow-left" label={card.backLabel} disabled={!card.canMoveBack} onClick={card.moveBack} />
          <IconButton
            icon="arrow-right"
            label={card.forwardLabel}
            disabled={!card.canMoveForward}
            onClick={card.moveForward}
          />
          <IconButton icon="trash" label="Delete task" tone="danger" onClick={card.requestDelete} />
        </div>
      )}
    </footer>
  );
}

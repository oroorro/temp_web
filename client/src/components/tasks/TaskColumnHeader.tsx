import type { BoardColumn } from '../../logic/boardLogic';
import { pluralize } from '../../logic/formatters';
import { Badge } from '../common/Badge';

interface TaskColumnHeaderProps {
  column: BoardColumn;
}

export function TaskColumnHeader({ column }: TaskColumnHeaderProps) {
  return (
    <header className="board-column__header">
      <div className="board-column__title">
        <span className={`dot dot--${column.tone}`} aria-hidden="true" />
        <h2>{column.label}</h2>
        <span className="board-column__count">{column.tasks.length}</span>
      </div>
      {column.overLimit ? (
        <Badge label="Over limit" tone="warning" />
      ) : (
        <span className="board-column__points">{pluralize(column.points, 'pt')}</span>
      )}
    </header>
  );
}

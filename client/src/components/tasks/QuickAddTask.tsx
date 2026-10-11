import { useState } from 'react';
import type { FormEvent } from 'react';
import { useBoardActions } from '../../hooks/domain/useBoardActions';
import { MAX_TASK_TITLE_LENGTH, normalizeTaskTitle } from '../../logic/taskLogic';
import type { TaskStatus } from '../../types/domain';
import { IconButton } from '../common/IconButton';

interface QuickAddTaskProps {
  status: TaskStatus;
  columnLabel: string;
}

/** One-line form at the bottom of a column; Enter adds a task straight into that column. */
export function QuickAddTask({ status, columnLabel }: QuickAddTaskProps) {
  const { addTask } = useBoardActions();
  const [draft, setDraft] = useState('');
  const title = normalizeTaskTitle(draft);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title) return;
    addTask({ title, status });
    setDraft('');
  };

  return (
    <form className="quick-add" onSubmit={handleSubmit}>
      <input
        className="control"
        value={draft}
        maxLength={MAX_TASK_TITLE_LENGTH}
        placeholder="Add a task…"
        aria-label={`Add a task to ${columnLabel}`}
        onChange={(event) => setDraft(event.target.value)}
      />
      <IconButton icon="plus" type="submit" label={`Add to ${columnLabel}`} disabled={!title} />
    </form>
  );
}

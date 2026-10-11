import { pluralize } from '../../logic/formatters';
import { TASK_STATUS_META } from '../../logic/labels';
import type { TaskTab } from '../../logic/teamLogic';
import type { TeamTask } from '../../types/domain';
import { Badge } from '../common/Badge';

interface MemberTaskListProps {
  tasks: TeamTask[];
  tab: TaskTab;
}

export function MemberTaskList({ tasks, tab }: MemberTaskListProps) {
  if (tasks.length === 0) {
    return <p className="team-detail__empty">{tab === 'open' ? 'No open tasks' : 'Nothing finished yet'}</p>;
  }

  return (
    <ul className="team-detail__list">
      {tasks.map((task) => {
        const { label, tone } = TASK_STATUS_META[task.status];
        return (
          <li key={task.id} className="team-detail__item">
            <div className="team-detail__item-text">
              <span className="team-detail__item-title">{task.title}</span>
              <span className="team-detail__item-meta">
                {task.projectName} · {pluralize(task.estimate, 'pt')}
              </span>
            </div>
            <Badge label={label} tone={tone} />
          </li>
        );
      })}
    </ul>
  );
}

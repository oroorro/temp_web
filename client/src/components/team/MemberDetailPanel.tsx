import { useMemberDetail } from '../../hooks/domain/useMemberDetail';
import type { TeamRow } from '../../logic/teamLogic';
import { Avatar } from '../common/Avatar';
import { IconButton } from '../common/IconButton';
import { SegmentedControl } from '../common/SegmentedControl';
import { StatusBadge } from '../projects/StatusBadge';
import { MemberTaskList } from './MemberTaskList';

interface MemberDetailPanelProps {
  row: TeamRow;
  onClose: () => void;
}

/** Projects and tasks of the selected member, all taken from the response the page already has. */
export function MemberDetailPanel({ row, onClose }: MemberDetailPanelProps) {
  const { member } = row;
  const { tab, setTab, tabOptions, tasks } = useMemberDetail(row);

  return (
    <aside className="team-detail" aria-label={`${member.name} details`}>
      <header className="team-detail__header">
        <Avatar name={member.name} color={member.color} />
        <div className="team-detail__identity">
          <h2 className="team-detail__name">{member.name}</h2>
          <p className="team-detail__role">{member.role}</p>
        </div>
        <IconButton icon="close" label="Close details" onClick={onClose} />
      </header>

      <section className="team-detail__section">
        <h3 className="team-detail__heading">Projects</h3>
        {member.projects.length === 0 ? (
          <p className="team-detail__empty">Not on any project</p>
        ) : (
          <ul className="team-detail__list">
            {member.projects.map((project) => (
              <li key={project.id} className="team-detail__item">
                <span className="team-detail__item-title">{project.name}</span>
                <StatusBadge status={project.status} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="team-detail__section">
        <div className="team-detail__section-header">
          <h3 className="team-detail__heading">Tasks</h3>
          <SegmentedControl label="Tasks" value={tab} options={tabOptions} onChange={setTab} />
        </div>
        <MemberTaskList tasks={tasks} tab={tab} />
      </section>
    </aside>
  );
}

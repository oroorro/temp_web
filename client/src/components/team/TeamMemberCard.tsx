import { cx } from '../../logic/classNames';
import { pluralize } from '../../logic/formatters';
import { describeWorkload } from '../../logic/teamLogic';
import type { TeamRow } from '../../logic/teamLogic';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';

interface TeamMemberCardProps {
  row: TeamRow;
  /** Open points of the busiest member; the workload bar is drawn relative to it. */
  pointsScale: number;
  isSelected: boolean;
  onSelect: (memberId: string) => void;
}

export function TeamMemberCard({ row, pointsScale, isSelected, onSelect }: TeamMemberCardProps) {
  const { member } = row;

  return (
    <article className={cx('team-card', isSelected && 'is-selected')}>
      <header className="team-card__header">
        <Avatar name={member.name} color={member.color} />
        <div className="team-card__identity">
          <h2 className="team-card__name">
            {/* The button's ::after covers the card, so the whole card is clickable. */}
            <button type="button" aria-pressed={isSelected} onClick={() => onSelect(member.id)}>
              {member.name}
            </button>
          </h2>
          <p className="team-card__role">{member.role}</p>
        </div>
      </header>

      <ProgressBar
        label={describeWorkload(row)}
        value={row.openPoints}
        max={pointsScale}
        valueLabel={pluralize(row.openPoints, 'pt')}
      />

      <footer className="team-card__footer">
        <span>{pluralize(member.projects.length, 'project')}</span>
        <Badge label={`${row.doneTasks} done`} />
      </footer>
    </article>
  );
}

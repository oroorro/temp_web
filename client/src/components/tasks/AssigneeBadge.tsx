import type { Member } from '../../types/domain';
import { Avatar } from '../common/Avatar';

interface AssigneeBadgeProps {
  member: Member | null;
}

export function AssigneeBadge({ member }: AssigneeBadgeProps) {
  if (!member) return <span className="assignee assignee--none">Unassigned</span>;

  return (
    <span className="assignee">
      <Avatar name={member.name} color={member.color} size="sm" />
      <span className="assignee__name">{member.name.split(' ')[0]}</span>
    </span>
  );
}

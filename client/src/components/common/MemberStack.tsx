import type { Member } from '../../types/domain';
import { Avatar } from './Avatar';

interface MemberStackProps {
  members: Member[];
  /** Avatars shown before the rest collapses into "+N". */
  max?: number;
}

export function MemberStack({ members, max = 4 }: MemberStackProps) {
  const shown = members.slice(0, max);
  const hidden = members.length - shown.length;

  return (
    <div className="member-stack">
      {shown.map((member) => (
        <Avatar key={member.id} name={member.name} color={member.color} size="sm" />
      ))}
      {hidden > 0 && <span className="member-stack__more">+{hidden}</span>}
    </div>
  );
}

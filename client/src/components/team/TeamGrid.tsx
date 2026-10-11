import type { TeamRow } from '../../logic/teamLogic';
import { TeamMemberCard } from './TeamMemberCard';

interface TeamGridProps {
  rows: TeamRow[];
  pointsScale: number;
  selectedId: string | null;
  onSelect: (memberId: string) => void;
}

export function TeamGrid({ rows, pointsScale, selectedId, onSelect }: TeamGridProps) {
  return (
    <ul className="team-grid">
      {rows.map((row) => (
        <li key={row.member.id}>
          <TeamMemberCard
            row={row}
            pointsScale={pointsScale}
            isSelected={row.member.id === selectedId}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  );
}

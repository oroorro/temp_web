import type { TeamRow } from '../../logic/teamLogic';
import { Avatar } from '../common/Avatar';

interface TeamTableRowProps {
  row: TeamRow;
  isSelected: boolean;
  onSelect: (memberId: string) => void;
}

export function TeamTableRow({ row, isSelected, onSelect }: TeamTableRowProps) {
  const { member } = row;

  return (
    <tr className={isSelected ? 'is-selected' : undefined}>
      <th scope="row">
        <span className="team-table__member">
          <Avatar name={member.name} color={member.color} size="sm" />
          <button type="button" aria-pressed={isSelected} onClick={() => onSelect(member.id)}>
            {member.name}
          </button>
        </span>
      </th>
      <td>{member.role}</td>
      <td className="is-numeric">{member.projects.length}</td>
      <td className="is-numeric">{row.openTasks}</td>
      <td className="is-numeric">{row.doneTasks}</td>
      <td className="is-numeric">{row.openPoints}</td>
      <td className="is-numeric">{row.completion}%</td>
    </tr>
  );
}

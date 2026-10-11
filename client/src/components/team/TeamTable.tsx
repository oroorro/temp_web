import type { TeamRow } from '../../logic/teamLogic';
import { TeamTableRow } from './TeamTableRow';

interface TeamTableProps {
  rows: TeamRow[];
  selectedId: string | null;
  onSelect: (memberId: string) => void;
}

export function TeamTable({ rows, selectedId, onSelect }: TeamTableProps) {
  return (
    <div className="team-table">
      <table>
        <thead>
          <tr>
            <th scope="col">Member</th>
            <th scope="col">Role</th>
            <th scope="col" className="is-numeric">
              Projects
            </th>
            <th scope="col" className="is-numeric">
              Open
            </th>
            <th scope="col" className="is-numeric">
              Done
            </th>
            <th scope="col" className="is-numeric">
              Open pts
            </th>
            <th scope="col" className="is-numeric">
              Completion
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <TeamTableRow
              key={row.member.id}
              row={row}
              isSelected={row.member.id === selectedId}
              onSelect={onSelect}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

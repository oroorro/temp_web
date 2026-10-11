import type { TeamRow } from '../../logic/teamLogic';
import type { TeamLayout } from '../../types/ui';
import { EmptyState } from '../common/EmptyState';
import { TeamGrid } from './TeamGrid';
import { TeamTable } from './TeamTable';

interface TeamDirectoryProps {
  rows: TeamRow[];
  layout: TeamLayout;
  pointsScale: number;
  selectedId: string | null;
  isFiltered: boolean;
  onSelect: (memberId: string) => void;
  onResetFilters: () => void;
}

/** The member list in the chosen layout; switching layouts unmounts one and mounts the other. */
export function TeamDirectory({
  rows,
  layout,
  pointsScale,
  selectedId,
  isFiltered,
  onSelect,
  onResetFilters,
}: TeamDirectoryProps) {
  if (rows.length === 0) {
    return isFiltered ? (
      <EmptyState
        title="No members match"
        description="Try a different search or role."
        actionLabel="Clear filters"
        onAction={onResetFilters}
      />
    ) : (
      <EmptyState title="No members yet" />
    );
  }

  return layout === 'cards' ? (
    <TeamGrid rows={rows} pointsScale={pointsScale} selectedId={selectedId} onSelect={onSelect} />
  ) : (
    <TeamTable rows={rows} selectedId={selectedId} onSelect={onSelect} />
  );
}

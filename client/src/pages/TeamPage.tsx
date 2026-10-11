import { AsyncBoundary } from '../components/common/AsyncBoundary';
import { PageContainer } from '../components/layout/PageContainer';
import { MemberDetailPanel } from '../components/team/MemberDetailPanel';
import { TeamDirectory } from '../components/team/TeamDirectory';
import { TeamToolbar } from '../components/team/TeamToolbar';
import { useTeamDirectory } from '../hooks/domain/useTeamDirectory';
import { cx } from '../logic/classNames';

/** One request when the page mounts; every control on it only changes what is rendered from that response. */
export function TeamPage() {
  const team = useTeamDirectory();
  const { view, selected } = team;

  return (
    <PageContainer title="Team" subtitle={team.summary}>
      <TeamToolbar
        view={view}
        roleOptions={team.roleOptions}
        isFiltered={team.isFiltered}
        onChange={team.setOption}
        onReset={team.resetFilters}
      />
      <AsyncBoundary isLoading={team.isLoading} error={team.error} onRetry={team.refetch}>
        <div className={cx('team-layout', selected && 'team-layout--split')}>
          <TeamDirectory
            rows={team.rows}
            layout={view.layout}
            pointsScale={team.pointsScale}
            selectedId={view.selectedId}
            isFiltered={team.isFiltered}
            onSelect={team.toggleMember}
            onResetFilters={team.resetFilters}
          />
          {/* Keyed by member, so picking someone else mounts a fresh panel instead of updating this one. */}
          {selected && <MemberDetailPanel key={selected.member.id} row={selected} onClose={team.closeMember} />}
        </div>
      </AsyncBoundary>
    </PageContainer>
  );
}

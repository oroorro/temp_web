import { useParams } from 'react-router';
import { AsyncBoundary } from '../components/common/AsyncBoundary';
import { SelectInput } from '../components/common/SelectInput';
import { PageContainer } from '../components/layout/PageContainer';
import { ProjectOverview } from '../components/projects/ProjectOverview';
import { TaskBoard } from '../components/tasks/TaskBoard';
import { TaskFilterBar } from '../components/tasks/TaskFilterBar';
import { useProjectBoard } from '../hooks/domain/useProjectBoard';
import { PROJECT_STATUS_OPTIONS } from '../logic/labels';

export function ProjectDetailPage() {
  const { projectId = '' } = useParams();
  const { project, overview, board, boardCount, filters, actions, setStatus, isLoading, error, refetch } =
    useProjectBoard(projectId);

  return (
    <PageContainer
      title={project?.name ?? 'Project'}
      subtitle={project?.description}
      actions={
        project && (
          <SelectInput label="Status" value={project.status} options={PROJECT_STATUS_OPTIONS} onChange={setStatus} />
        )
      }
    >
      <AsyncBoundary isLoading={isLoading} error={error} onRetry={refetch}>
        {project && overview && (
          <>
            <ProjectOverview project={project} team={overview.team} due={overview.due} taskSummary={overview.taskSummary} />
            <TaskFilterBar
              filters={filters.filters}
              team={overview.team}
              countLabel={boardCount}
              isFiltered={filters.isFiltered}
              onChange={filters.setFilter}
              onReset={filters.reset}
            />
            <TaskBoard board={board} actions={actions} />
          </>
        )}
      </AsyncBoundary>
    </PageContainer>
  );
}

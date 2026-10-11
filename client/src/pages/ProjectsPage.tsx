import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { AsyncBoundary } from '../components/common/AsyncBoundary';
import { Button } from '../components/common/Button';
import { PageContainer } from '../components/layout/PageContainer';
import { NewProjectDialog } from '../components/projects/NewProjectDialog';
import { ProjectGrid } from '../components/projects/ProjectGrid';
import { ProjectToolbar } from '../components/projects/ProjectToolbar';
import { useProjectList } from '../hooks/domain/useProjectList';
import type { Project } from '../types/domain';

export function ProjectsPage() {
  const list = useProjectList();
  const navigate = useNavigate();
  const [isCreating, setCreating] = useState(false);

  const openDialog = useCallback(() => setCreating(true), []);
  const closeDialog = useCallback(() => setCreating(false), []);
  const openProject = useCallback((project: Project) => void navigate(`/projects/${project.id}`), [navigate]);

  return (
    <PageContainer
      title="Projects"
      subtitle={list.summary}
      actions={<Button label="New project" icon="plus" onClick={openDialog} />}
    >
      <ProjectToolbar
        filters={list.filters}
        sort={list.sort}
        isFiltered={list.isFiltered}
        onChange={list.setFilter}
        onReset={list.resetFilters}
      />
      <AsyncBoundary isLoading={list.isLoading} error={list.error} onRetry={list.refetch}>
        <ProjectGrid
          cards={list.cards}
          isFiltered={list.isFiltered}
          onResetFilters={list.resetFilters}
          onCreate={openDialog}
        />
      </AsyncBoundary>
      {isCreating && <NewProjectDialog onClose={closeDialog} onCreated={openProject} />}
    </PageContainer>
  );
}

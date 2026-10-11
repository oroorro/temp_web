import type { ProjectCardModel } from '../../logic/projectLogic';
import { EmptyState } from '../common/EmptyState';
import { ProjectCard } from './ProjectCard';

interface ProjectGridProps {
  cards: ProjectCardModel[];
  isFiltered: boolean;
  onResetFilters: () => void;
  onCreate: () => void;
}

export function ProjectGrid({ cards, isFiltered, onResetFilters, onCreate }: ProjectGridProps) {
  if (cards.length === 0) {
    return isFiltered ? (
      <EmptyState
        title="No projects match"
        description="Try a different search or status."
        actionLabel="Clear filters"
        onAction={onResetFilters}
      />
    ) : (
      <EmptyState
        title="No projects yet"
        description="Create the first one to start tracking work."
        actionLabel="New project"
        onAction={onCreate}
      />
    );
  }

  return (
    <ul className="project-grid">
      {cards.map((card) => (
        <li key={card.project.id}>
          <ProjectCard card={card} />
        </li>
      ))}
    </ul>
  );
}

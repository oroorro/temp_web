import { Link } from 'react-router';
import type { ProjectCardModel } from '../../logic/projectLogic';
import { Badge } from '../common/Badge';
import { MemberStack } from '../common/MemberStack';
import { ProgressBar } from '../common/ProgressBar';
import { StatusBadge } from './StatusBadge';
import { TagList } from './TagList';

interface ProjectCardProps {
  card: ProjectCardModel;
}

export function ProjectCard({ card }: ProjectCardProps) {
  const { project, members, due, taskSummary } = card;

  return (
    <article className="project-card">
      <header className="project-card__header">
        <h2 className="project-card__name">
          {/* The link's ::after covers the card, so the whole card is clickable. */}
          <Link to={`/projects/${project.id}`}>{project.name}</Link>
        </h2>
        <StatusBadge status={project.status} />
      </header>

      <p className="project-card__description">{project.description || 'No description'}</p>
      <TagList tags={project.tags} />

      <ProgressBar label={taskSummary} value={project.progress} valueLabel={`${project.progress}%`} />

      <footer className="project-card__footer">
        <MemberStack members={members} />
        {due && <Badge label={due.label} tone={due.tone} />}
      </footer>
    </article>
  );
}

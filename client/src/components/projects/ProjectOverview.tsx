import type { DueInfo } from '../../logic/formatters';
import type { Member, Project } from '../../types/domain';
import { Badge } from '../common/Badge';
import { MemberStack } from '../common/MemberStack';
import { ProgressBar } from '../common/ProgressBar';
import { StatusBadge } from './StatusBadge';
import { TagList } from './TagList';

interface ProjectOverviewProps {
  project: Project;
  team: Member[];
  due: DueInfo | null;
  taskSummary: string;
}

export function ProjectOverview({ project, team, due, taskSummary }: ProjectOverviewProps) {
  return (
    <section className="project-overview" aria-label="Project overview">
      <div className="project-overview__facts">
        <StatusBadge status={project.status} />
        {due && <Badge label={due.label} tone={due.tone} />}
        <TagList tags={project.tags} />
      </div>
      <div className="project-overview__progress">
        <ProgressBar label={taskSummary} value={project.progress} valueLabel={`${project.progress}%`} />
      </div>
      <div className="project-overview__team">
        <span className="project-overview__team-label">Team</span>
        <MemberStack members={team} max={6} />
      </div>
    </section>
  );
}

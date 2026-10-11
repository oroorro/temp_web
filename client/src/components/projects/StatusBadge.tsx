import { PROJECT_STATUS_META } from '../../logic/labels';
import type { ProjectStatus } from '../../types/domain';
import { Badge } from '../common/Badge';

interface StatusBadgeProps {
  status: ProjectStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, tone } = PROJECT_STATUS_META[status];
  return <Badge label={label} tone={tone} />;
}

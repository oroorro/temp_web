import type { Tone } from '../../types/ui';
import { Badge } from './Badge';

interface StatTileProps {
  label: string;
  value: string;
  hint?: string;
  badge?: string;
  badgeTone?: Tone;
}

export function StatTile({ label, value, hint, badge, badgeTone = 'neutral' }: StatTileProps) {
  return (
    <div className="stat-tile">
      <div className="stat-tile__top">
        <span className="stat-tile__label">{label}</span>
        {badge && <Badge label={badge} tone={badgeTone} />}
      </div>
      <strong className="stat-tile__value">{value}</strong>
      {hint && <span className="stat-tile__hint">{hint}</span>}
    </div>
  );
}

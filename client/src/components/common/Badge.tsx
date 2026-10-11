import type { Tone } from '../../types/ui';

interface BadgeProps {
  label: string;
  tone?: Tone;
}

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  return <span className={`badge badge--${tone}`}>{label}</span>;
}

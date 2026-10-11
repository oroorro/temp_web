import { toRatio } from '../../logic/formatters';
import type { Tone } from '../../types/ui';

interface ProgressBarProps {
  label?: string;
  value: number;
  max?: number;
  /** Text shown on the right; defaults to the raw value. */
  valueLabel?: string;
  tone?: Tone;
}

export function ProgressBar({ label, value, max = 100, valueLabel, tone = 'accent' }: ProgressBarProps) {
  const percent = Math.round(toRatio(value, max) * 100);
  const text = valueLabel ?? String(value);

  return (
    <div className="progress">
      <div className="progress__header">
        {label && <span className="progress__label">{label}</span>}
        <span className="progress__value">{text}</span>
      </div>
      <div
        className="progress__track"
        role="progressbar"
        aria-label={label ?? text}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className={`progress__fill progress__fill--${tone}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

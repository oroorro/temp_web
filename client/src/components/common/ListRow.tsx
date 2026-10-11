import type { Tone } from '../../types/ui';
import { Badge } from './Badge';

interface ListRowProps {
  title: string;
  description?: string;
  meta?: string;
  badge?: string;
  badgeTone?: Tone;
  /** Makes the whole row a button. */
  onClick?: () => void;
}

export function ListRow({ title, description, meta, badge, badgeTone = 'neutral', onClick }: ListRowProps) {
  const content = (
    <>
      <span className="list-row__text">
        <span className="list-row__title">{title}</span>
        {description && <span className="list-row__description">{description}</span>}
      </span>
      {badge && <Badge label={badge} tone={badgeTone} />}
      {meta && <span className="list-row__meta">{meta}</span>}
    </>
  );

  if (onClick) {
    return (
      <button type="button" className="list-row list-row--interactive" onClick={onClick}>
        {content}
      </button>
    );
  }
  return <div className="list-row">{content}</div>;
}

import type { CSSProperties, ReactNode } from 'react';

interface GridProps {
  /** Columns never get narrower than this many pixels. */
  minItemWidth?: number;
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  children?: ReactNode;
}

export function Grid({ minItemWidth = 240, gap = 'md', children }: GridProps) {
  const style = { '--grid-min': `${minItemWidth}px` } as CSSProperties;
  return (
    <div className={`grid gap-${gap}`} style={style}>
      {children}
    </div>
  );
}

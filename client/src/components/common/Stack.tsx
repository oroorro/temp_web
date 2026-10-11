import type { ReactNode } from 'react';
import { cx } from '../../logic/classNames';

interface StackProps {
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  direction?: 'vertical' | 'horizontal';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'between' | 'end';
  children?: ReactNode;
}

export function Stack({
  gap = 'md',
  direction = 'vertical',
  align = 'stretch',
  justify = 'start',
  children,
}: StackProps) {
  return (
    <div
      className={cx(
        'stack',
        `stack--${direction}`,
        `gap-${gap}`,
        `stack--align-${align}`,
        `stack--justify-${justify}`,
      )}
    >
      {children}
    </div>
  );
}

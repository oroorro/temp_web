import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  /** Rendered on the right of the heading. */
  aside?: ReactNode;
  children?: ReactNode;
}

export function Card({ title, subtitle, aside, children }: CardProps) {
  const hasHeader = Boolean(title || subtitle || aside);
  return (
    <section className="card">
      {hasHeader && (
        <header className="card__header">
          <div>
            {title && <h2 className="card__title">{title}</h2>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
          {aside}
        </header>
      )}
      {children}
    </section>
  );
}

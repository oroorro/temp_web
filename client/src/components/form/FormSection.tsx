import type { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="form-section">
      <header className="form-section__header">
        <h2 className="form-section__title">{title}</h2>
        {description && <p className="form-section__description">{description}</p>}
      </header>
      <div className="form-section__fields">{children}</div>
    </section>
  );
}

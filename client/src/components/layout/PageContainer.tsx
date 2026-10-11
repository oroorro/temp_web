import type { ReactNode } from 'react';
import { useDocumentTitle } from '../../hooks/domain/useDocumentTitle';
import { PageHeader } from './PageHeader';

interface PageContainerProps {
  title: string;
  subtitle?: string;
  /** Buttons shown on the right of the heading. */
  actions?: ReactNode;
  children: ReactNode;
}

/** Standard page body: sets the tab title and renders the heading above the content. */
export function PageContainer({ title, subtitle, actions, children }: PageContainerProps) {
  useDocumentTitle(title);

  return (
    <div className="page">
      <PageHeader title={title} subtitle={subtitle} actions={actions} />
      <div className="page__body">{children}</div>
    </div>
  );
}

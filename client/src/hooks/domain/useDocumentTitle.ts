import { useEffect } from 'react';
import { formatDocumentTitle } from '../../logic/formatters';
import { useWorkspaceSettings } from './useWorkspaceSettings';

export function useDocumentTitle(pageTitle: string) {
  const { settings } = useWorkspaceSettings();

  useEffect(() => {
    document.title = formatDocumentTitle(pageTitle, settings.workspaceName);
  }, [pageTitle, settings.workspaceName]);
}

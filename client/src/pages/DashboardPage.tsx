import { AsyncBoundary } from '../components/common/AsyncBoundary';
import { Button } from '../components/common/Button';
import { PageContainer } from '../components/layout/PageContainer';
import { useDashboard } from '../hooks/domain/useDashboard';
import { SchemaRenderer } from '../ui-schema/SchemaRenderer';
import { dashboardPage } from '../ui-schema/declarations';

/** The whole page body is declared in `dashboard.page.json`; this component supplies its data. */
export function DashboardPage() {
  const { scope, actions, isLoading, isRefreshing, error, refetch } = useDashboard();

  return (
    <PageContainer
      title="Dashboard"
      subtitle="How work is moving across the workspace"
      actions={
        <Button
          label={isRefreshing ? 'Refreshing…' : 'Refresh'}
          variant="secondary"
          icon="refresh"
          disabled={isRefreshing}
          onClick={refetch}
        />
      }
    >
      <AsyncBoundary isLoading={isLoading} error={error} onRetry={refetch}>
        {scope && <SchemaRenderer declaration={dashboardPage} scope={scope} actions={actions} />}
      </AsyncBoundary>
    </PageContainer>
  );
}

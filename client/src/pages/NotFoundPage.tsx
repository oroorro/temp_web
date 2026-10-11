import { useNavigate } from 'react-router';
import { EmptyState } from '../components/common/EmptyState';
import { PageContainer } from '../components/layout/PageContainer';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageContainer title="Page not found">
      <EmptyState
        title="There is nothing at this address"
        description="The link may be out of date."
        actionLabel="Go to the dashboard"
        onAction={() => void navigate('/')}
      />
    </PageContainer>
  );
}

import type { ReactNode } from 'react';
import { EmptyState } from './EmptyState';
import { Spinner } from './Spinner';

interface AsyncBoundaryProps {
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  children: ReactNode;
}

/** Shows a spinner or an error with a retry button until the content behind it can render. */
export function AsyncBoundary({ isLoading, error, onRetry, children }: AsyncBoundaryProps) {
  if (isLoading) return <Spinner />;
  if (error) {
    return <EmptyState title="Could not load this" description={error} actionLabel="Try again" onAction={onRetry} />;
  }
  return <>{children}</>;
}

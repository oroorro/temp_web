import { useEffect } from 'react';
import type { Toast } from '../../store/uiStore';
import { IconButton } from '../common/IconButton';

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: number) => void;
}

const VISIBLE_MS = 4000;
// Errors stay up longer so there is time to read them.
const ERROR_VISIBLE_MS = 7000;

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const { id, tone, message } = toast;

  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(id), tone === 'error' ? ERROR_VISIBLE_MS : VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [id, tone, onDismiss]);

  return (
    <div className={`toast toast--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <span>{message}</span>
      <IconButton icon="close" label="Dismiss" onClick={() => onDismiss(id)} />
    </div>
  );
}

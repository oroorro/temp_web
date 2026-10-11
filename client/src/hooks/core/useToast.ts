import { useMemo } from 'react';
import { useUiStore } from '../../store/uiStore';

export function useToast() {
  const pushToast = useUiStore((state) => state.pushToast);

  return useMemo(
    () => ({
      success: (message: string) => pushToast('success', message),
      error: (message: string) => pushToast('error', message),
      info: (message: string) => pushToast('info', message),
    }),
    [pushToast],
  );
}

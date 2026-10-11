import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemePreference } from '../logic/themeLogic';

export type ToastTone = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  tone: ToastTone;
  message: string;
}

interface UiState {
  theme: ThemePreference;
  sidebarCollapsed: boolean;
  toasts: Toast[];
  setTheme: (theme: ThemePreference) => void;
  toggleSidebar: () => void;
  pushToast: (tone: ToastTone, message: string) => void;
  dismissToast: (id: number) => void;
}

const MAX_TOASTS = 4;
let nextToastId = 1;

/** Client-only UI state. Theme and sidebar survive reloads; toasts do not. */
export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarCollapsed: false,
      toasts: [],
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      pushToast: (tone, message) =>
        set((state) => ({
          toasts: [...state.toasts, { id: nextToastId++, tone, message }].slice(-MAX_TOASTS),
        })),
      dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
    }),
    {
      name: 'workspace-ui',
      partialize: (state) => ({ theme: state.theme, sidebarCollapsed: state.sidebarCollapsed }),
    },
  ),
);

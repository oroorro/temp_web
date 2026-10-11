import { Outlet } from 'react-router';
import { useTheme } from '../../hooks/core/useTheme';
import { cx } from '../../logic/classNames';
import { useUiStore } from '../../store/uiStore';
import { ToastViewport } from '../feedback/ToastViewport';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

/** Frame shared by every page: sidebar, top bar, the routed page and toasts. */
export function AppShell() {
  useTheme();
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);

  return (
    <div className={cx('shell', sidebarCollapsed && 'shell--collapsed')}>
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="shell__main">
        <TopBar />
        <main className="shell__content">
          <Outlet />
        </main>
      </div>
      <ToastViewport />
    </div>
  );
}

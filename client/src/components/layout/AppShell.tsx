import type { ReactNode } from 'react';
import { Outlet } from 'react-router';
import { useTheme } from '../../hooks/core/useTheme';
import { cx } from '../../logic/classNames';
import { useUiStore } from '../../store/uiStore';
import { ToastViewport } from '../feedback/ToastViewport';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppShellProps {
  /** Overrides the workspace name shown in the sidebar brand. */
  brandName?: string;
  /** Rendered at the bottom of the sidebar. */
  sidebarFooter?: ReactNode;
  showBreadcrumbs?: boolean;
  /** Extra controls rendered next to the theme toggle in the top bar. */
  topBarActions?: ReactNode;
  contentClassName?: string;
}

/** Removes duplicate classes from the prop and adds a modifier while the sidebar is collapsed. */
function getContentClassName(contentClassName: string | undefined, collapsed: boolean): string {
  const extraClasses = new Set(contentClassName?.split(/\s+/).filter(Boolean));
  return cx('shell__content', ...extraClasses, collapsed && 'shell__content--wide');
}

function getShellClassName(collapsed: boolean, toastCount: number): string {
  return cx('shell', collapsed && 'shell--collapsed', toastCount > 0 && 'shell--has-toasts');
}

/** Frame shared by every page: sidebar, top bar, the routed page and toasts. */
export function AppShell({
  brandName,
  sidebarFooter,
  showBreadcrumbs = true,
  topBarActions,
  contentClassName,
}: AppShellProps) {
  useTheme();
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);
  const toastCount = useUiStore((state) => state.toasts.length);

  const brand = brandName?.trim() || undefined;

  const notificationLabel =
    toastCount > 0 ? `${toastCount} notification${toastCount === 1 ? '' : 's'}` : null;

  const year = new Date().getFullYear();
  const footer = sidebarFooter ?? <span>© {year}</span>;

  const mainClassName = getContentClassName(contentClassName, sidebarCollapsed);

  return (
    <div className={getShellClassName(sidebarCollapsed, toastCount)}>
      <Sidebar collapsed={sidebarCollapsed} brandName={brand} footer={footer} />
      <div className="shell__main">
        <TopBar
          showBreadcrumbs={showBreadcrumbs}
          actions={
            <>
              {notificationLabel && <span className="topbar__badge">{notificationLabel}</span>}
              {topBarActions}
            </>
          }
        />
        <main className={mainClassName}>
          <Outlet />
        </main>
      </div>
      <ToastViewport />
    </div>
  );
}

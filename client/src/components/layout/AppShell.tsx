import { useEffect, useState, type ReactNode } from 'react';
import { Outlet } from 'react-router';
import { useTheme } from '../../hooks/core/useTheme';
import { useWorkspaceSettings } from '../../hooks/domain/useWorkspaceSettings';
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

const SLOW_LOADING_MS = 3000;

/** Removes duplicate classes from the prop and adds a modifier while the sidebar is collapsed. */
function getContentClassName(contentClassName: string | undefined, collapsed: boolean): string {
  const extraClasses = new Set(contentClassName?.split(/\s+/).filter(Boolean));
  return cx('shell__content', ...extraClasses, collapsed && 'shell__content--wide');
}

function getShellClassName(collapsed: boolean, toastCount: number): string {
  return cx('shell', collapsed && 'shell--collapsed', toastCount > 0 && 'shell--has-toasts');
}

function getGreeting(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function ShellGreeting() {
  const greeting = getGreeting(new Date().getHours());

  return <span className="topbar__greeting">{greeting}</span>;
}

function describeShellStatus(collapsed: boolean, toastCount: number): string {
  const sidebar = collapsed ? 'Sidebar collapsed' : 'Sidebar expanded';
  const toasts = toastCount === 0 ? 'No notifications' : `${toastCount} notification${toastCount === 1 ? '' : 's'}`;
  return `${sidebar} · ${toasts}`;
}

function getStatusClassName(toastCount: number): string {
  return cx('shell__status', toastCount > 0 && 'shell__status--alert');
}

interface ShellStatusBarProps {
  collapsed: boolean;
  toastCount: number;
}

function ShellStatusBar({ collapsed, toastCount }: ShellStatusBarProps) {
  const statusClassName = getStatusClassName(toastCount);

  return <footer className={statusClassName}>{describeShellStatus(collapsed, toastCount)}</footer>;
}

/** Empty placeholder with the same layout as `AppShell`, for use while the app is loading. */
export function AppShellSkeleton() {
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsSlow(true), SLOW_LOADING_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const loadingMessage = isSlow ? 'Still loading, hang tight…' : 'Loading…';

  return (
    <div className={getShellClassName(sidebarCollapsed, 0)} aria-busy="true">
      <aside className="sidebar" />
      <div className="shell__main">
        <header className="topbar" />
        <main className="shell__content">
          <p role="status">{loadingMessage}</p>
        </main>
      </div>
    </div>
  );
}

/** Frame shared by every page: sidebar, top bar, the routed page and toasts. */
export function AppShell({
  brandName,
  sidebarFooter,
  showBreadcrumbs = true,
  topBarActions,
  contentClassName,
}: AppShellProps) { // all the props will be displayed in the component 
  //display for AppShell component from here 
  useTheme();
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);
  const toastCount = useUiStore((state) => state.toasts.length);
  const { isLoading: settingsLoading } = useWorkspaceSettings();

  if (settingsLoading) return <AppShellSkeleton />;

  const brand = brandName?.trim() || undefined;

  const notificationLabel =
    toastCount > 0 ? `${toastCount} notification${toastCount === 1 ? '' : 's'}` : null;

  const year = new Date().getFullYear();
  const footer = sidebarFooter ?? <span>© {year}</span>;

  const mainClassName = getContentClassName(contentClassName, sidebarCollapsed);
  //To here 

  return (
    <div className={getShellClassName(sidebarCollapsed, toastCount)}>
      <Sidebar collapsed={sidebarCollapsed} brandName={brand} footer={footer} />
      <div className="shell__main">
        <TopBar
          showBreadcrumbs={showBreadcrumbs}
          actions={
            <>
              <ShellGreeting />
              {notificationLabel && <span className="topbar__badge">{notificationLabel}</span>}
              {topBarActions}
            </>
          }
        />
        <main className={mainClassName}>
          <Outlet />
        </main>
        <ShellStatusBar collapsed={sidebarCollapsed} toastCount={toastCount} />
      </div>
      <ToastViewport />
    </div>
  );
}

import type { IconName } from '../types/ui';

export interface NavItem {
  to: string;
  label: string;
  icon: IconName;
  /** Match the path exactly instead of by prefix. */
  end: boolean;
}

export interface Breadcrumb {
  label: string;
  /** Missing on the last crumb, which is the current page. */
  to?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/projects', label: 'Projects', icon: 'folder', end: false },
  { to: '/team', label: 'Team', icon: 'users', end: false },
  { to: '/settings', label: 'Settings', icon: 'settings', end: false },
];

const PROJECT_PATH = /^\/projects\/([^/]+)\/?$/;

export function matchProjectId(pathname: string): string | null {
  const match = PROJECT_PATH.exec(pathname);
  return match ? decodeURIComponent(match[1]) : null;
}

export function buildBreadcrumbs(pathname: string, projectName: string | undefined): Breadcrumb[] {
  if (matchProjectId(pathname) !== null) {
    return [{ label: 'Projects', to: '/projects' }, { label: projectName ?? 'Project' }];
  }
  const current = NAV_ITEMS.find((item) => (item.end ? pathname === item.to : pathname.startsWith(item.to)));
  return [{ label: current?.label ?? 'Not found' }];
}

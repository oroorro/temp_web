import type { ReactNode } from 'react';
import { useUiStore } from '../../store/uiStore';
import { IconButton } from '../common/IconButton';
import { Breadcrumbs } from './Breadcrumbs';
import { ThemeToggle } from './ThemeToggle';

interface TopBarProps {
  showBreadcrumbs?: boolean;
  actions?: ReactNode;
}

export function TopBar({ showBreadcrumbs = true, actions }: TopBarProps) {
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <header className="topbar">
      <IconButton icon="menu" label="Toggle sidebar" onClick={toggleSidebar} />
      {showBreadcrumbs && <Breadcrumbs />}
      <div className="topbar__end">
        {actions}
        <ThemeToggle />
      </div>
    </header>
  );
}

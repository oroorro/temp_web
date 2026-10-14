import type { ReactNode } from 'react';
import { useWorkspaceSettings } from '../../hooks/domain/useWorkspaceSettings';
import { initials } from '../../logic/formatters';
import { NAV_ITEMS } from '../../logic/navigationLogic';
import { SidebarNav } from './SidebarNav';

interface SidebarProps {
  collapsed: boolean;
  brandName?: string;
  footer?: ReactNode;
}

export function Sidebar({ collapsed, brandName, footer }: SidebarProps) {
  const { settings } = useWorkspaceSettings();
  const name = brandName ?? settings.workspaceName;

  return (
    <aside className="sidebar">
      <div className="sidebar__brand" title={name}>
        <span className="sidebar__logo" aria-hidden="true">
          {initials(name)}
        </span>
        {!collapsed && <span className="sidebar__name">{name}</span>}
      </div>
      <SidebarNav items={NAV_ITEMS} collapsed={collapsed} />
      {footer && !collapsed && <div className="sidebar__footer">{footer}</div>}
    </aside>
  );
}

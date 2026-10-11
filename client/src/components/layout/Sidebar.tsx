import { useWorkspaceSettings } from '../../hooks/domain/useWorkspaceSettings';
import { initials } from '../../logic/formatters';
import { NAV_ITEMS } from '../../logic/navigationLogic';
import { SidebarNav } from './SidebarNav';

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const { settings } = useWorkspaceSettings();

  return (
    <aside className="sidebar">
      <div className="sidebar__brand" title={settings.workspaceName}>
        <span className="sidebar__logo" aria-hidden="true">
          {initials(settings.workspaceName)}
        </span>
        {!collapsed && <span className="sidebar__name">{settings.workspaceName}</span>}
      </div>
      <SidebarNav items={NAV_ITEMS} collapsed={collapsed} />
    </aside>
  );
}

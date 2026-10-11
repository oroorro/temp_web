import type { NavItem } from '../../logic/navigationLogic';
import { SidebarLink } from './SidebarLink';

interface SidebarNavProps {
  items: NavItem[];
  collapsed: boolean;
}

export function SidebarNav({ items, collapsed }: SidebarNavProps) {
  return (
    <nav className="sidebar__nav" aria-label="Main">
      <ul>
        {items.map((item) => (
          <li key={item.to}>
            <SidebarLink item={item} collapsed={collapsed} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

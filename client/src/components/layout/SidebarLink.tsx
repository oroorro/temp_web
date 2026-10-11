import { NavLink } from 'react-router';
import { cx } from '../../logic/classNames';
import type { NavItem } from '../../logic/navigationLogic';
import { Icon } from '../common/Icon';

interface SidebarLinkProps {
  item: NavItem;
  collapsed: boolean;
}

export function SidebarLink({ item, collapsed }: SidebarLinkProps) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) => cx('sidebar__link', isActive && 'is-active')}
      title={collapsed ? item.label : undefined}
      aria-label={collapsed ? item.label : undefined}
    >
      <Icon name={item.icon} />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );
}

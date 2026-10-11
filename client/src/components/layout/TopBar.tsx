import { useUiStore } from '../../store/uiStore';
import { IconButton } from '../common/IconButton';
import { Breadcrumbs } from './Breadcrumbs';
import { ThemeToggle } from './ThemeToggle';

export function TopBar() {
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <header className="topbar">
      <IconButton icon="menu" label="Toggle sidebar" onClick={toggleSidebar} />
      <Breadcrumbs />
      <div className="topbar__end">
        <ThemeToggle />
      </div>
    </header>
  );
}

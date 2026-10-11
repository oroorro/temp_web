import { Link } from 'react-router';
import { useBreadcrumbs } from '../../hooks/domain/useBreadcrumbs';

export function Breadcrumbs() {
  const crumbs = useBreadcrumbs();

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {crumbs.map((crumb) => (
          <li key={crumb.label}>
            {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

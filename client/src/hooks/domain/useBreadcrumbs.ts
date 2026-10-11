import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { keys } from '../../api/keys';
import { buildBreadcrumbs, matchProjectId } from '../../logic/navigationLogic';
import { useResourceStore } from '../../store/resourceStore';
import type { Project } from '../../types/domain';

/** Breadcrumb trail for the current URL; project pages show the project's name once it is cached. */
export function useBreadcrumbs() {
  const { pathname } = useLocation();
  const projectId = matchProjectId(pathname);
  const projectName = useResourceStore((state) => {
    if (!projectId) return undefined;
    const project = state.entries[keys.project(projectId)]?.data as Project | undefined;
    return project?.name;
  });

  return useMemo(() => buildBreadcrumbs(pathname, projectName), [pathname, projectName]);
}

/** Cache keys for the resource store. Keep them prefix-friendly: invalidation matches by prefix. */
export const keys = {
  members: () => 'members',
  team: () => 'team',
  settings: () => 'settings',
  dashboard: () => 'dashboard',
  activity: (limit: number) => `activity?limit=${limit}`,
  projects: (query: string) => `projects?${query}`,
  project: (projectId: string) => `project/${projectId}`,
  projectTasks: (projectId: string) => `project/${projectId}/tasks`,
};

/** Key prefixes that go stale after each kind of write. */
export const invalidation = {
  projectChanged: (projectId?: string) => [
    'projects?',
    'dashboard',
    'activity',
    'team',
    ...(projectId ? [keys.project(projectId)] : []),
  ],
  taskChanged: (projectId: string) => ['projects?', 'dashboard', 'activity', 'team', keys.project(projectId)],
  settingsChanged: () => ['activity'],
};

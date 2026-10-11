const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Builds a fresh copy of the demo data. Dates are relative to `now` so the
 * dashboard always has a mix of upcoming and overdue work.
 */
export function createSeed(now = Date.now()) {
  const timestamp = (offsetDays) => new Date(now + offsetDays * DAY_MS).toISOString();
  const dateOnly = (offsetDays) => timestamp(offsetDays).slice(0, 10);

  const members = [
    { id: 'm-ava', name: 'Ava Lindqvist', role: 'Product lead', color: '#6366f1' },
    { id: 'm-noah', name: 'Noah Okafor', role: 'Frontend engineer', color: '#0ea5e9' },
    { id: 'm-mei', name: 'Mei Tanaka', role: 'Backend engineer', color: '#10b981' },
    { id: 'm-leo', name: 'Leo Marchetti', role: 'Designer', color: '#f59e0b' },
    { id: 'm-sara', name: 'Sara Haddad', role: 'QA engineer', color: '#ef4444' },
    { id: 'm-jon', name: 'Jon Bergström', role: 'DevOps engineer', color: '#8b5cf6' },
  ];

  const project = (id, name, description, status, ownerId, memberIds, tags, dueIn, createdAgo, updatedAgo) => ({
    id,
    name,
    description,
    status,
    ownerId,
    memberIds,
    tags,
    dueDate: dueIn === null ? null : dateOnly(dueIn),
    createdAt: timestamp(-createdAgo),
    updatedAt: timestamp(-updatedAgo),
  });

  const projects = [
    project('p-web', 'Website redesign', 'Refresh the marketing site with the new brand system and faster page loads.',
      'active', 'm-ava', ['m-ava', 'm-noah', 'm-leo', 'm-sara'], ['marketing', 'design'], 12, 45, 0.2),
    project('p-mobile', 'Mobile app v2', 'Offline mode, push notifications and a rebuilt onboarding flow.',
      'active', 'm-noah', ['m-noah', 'm-mei', 'm-leo', 'm-sara'], ['mobile', 'product'], 34, 60, 1),
    project('p-billing', 'Billing migration', 'Move subscriptions to the new payment provider without downtime.',
      'active', 'm-mei', ['m-mei', 'm-jon', 'm-sara'], ['backend', 'payments'], -3, 75, 0.5),
    project('p-infra', 'Observability rollout', 'Tracing, structured logs and on-call dashboards for every service.',
      'paused', 'm-jon', ['m-jon', 'm-mei'], ['infrastructure'], 50, 90, 9),
    project('p-search', 'Search relevance', 'Explore semantic ranking for the in-app search results.',
      'planning', 'm-ava', ['m-ava', 'm-mei'], ['research', 'backend'], null, 6, 2),
    project('p-docs', 'Docs portal', 'Public documentation site with versioned API reference.',
      'done', 'm-leo', ['m-leo', 'm-noah'], ['docs'], -20, 120, 18),
  ];

  let taskNumber = 0;
  const task = (projectId, title, status, priority, assigneeId, estimate, updatedAgo, description = '') => {
    taskNumber += 1;
    return {
      id: `t-${String(taskNumber).padStart(3, '0')}`,
      projectId,
      title,
      description,
      status,
      priority,
      assigneeId,
      estimate,
      createdAt: timestamp(-(updatedAgo + 5)),
      updatedAt: timestamp(-updatedAgo),
    };
  };

  const tasks = [
    task('p-web', 'Audit current page performance', 'done', 'medium', 'm-noah', 3, 20),
    task('p-web', 'Define typography and colour tokens', 'done', 'high', 'm-leo', 5, 14),
    task('p-web', 'Build the new landing hero', 'review', 'high', 'm-noah', 5, 1, 'Includes the animated product screenshot.'),
    task('p-web', 'Pricing page layout', 'in_progress', 'high', 'm-leo', 5, 0.5),
    task('p-web', 'Migrate blog posts to the new CMS', 'in_progress', 'medium', 'm-noah', 8, 2),
    task('p-web', 'Cross-browser QA pass', 'todo', 'medium', 'm-sara', 3, 3),
    task('p-web', 'Write launch announcement', 'todo', 'low', 'm-ava', 2, 4),
    task('p-web', 'Set up redirects from old URLs', 'todo', 'high', null, 2, 4),

    task('p-mobile', 'Offline storage spike', 'done', 'high', 'm-mei', 5, 16),
    task('p-mobile', 'Onboarding flow wireframes', 'done', 'medium', 'm-leo', 3, 12),
    task('p-mobile', 'Sync conflict resolution', 'in_progress', 'high', 'm-mei', 8, 1, 'Last-write-wins is not good enough for shared lists.'),
    task('p-mobile', 'Push notification service', 'in_progress', 'medium', 'm-noah', 5, 2),
    task('p-mobile', 'Onboarding screens', 'review', 'medium', 'm-noah', 5, 1.5),
    task('p-mobile', 'Accessibility audit', 'todo', 'medium', 'm-sara', 3, 5),
    task('p-mobile', 'Beta tester recruitment', 'todo', 'low', 'm-ava', 2, 6),
    task('p-mobile', 'App store screenshots', 'todo', 'low', 'm-leo', 2, 6),

    task('p-billing', 'Map legacy plans to new products', 'done', 'high', 'm-mei', 3, 25),
    task('p-billing', 'Webhook handler for payment events', 'done', 'high', 'm-mei', 5, 11),
    task('p-billing', 'Dual-write subscriptions', 'review', 'high', 'm-mei', 8, 0.6),
    task('p-billing', 'Backfill invoices', 'in_progress', 'high', 'm-jon', 5, 0.8, 'Roughly 40k invoices, run in batches.'),
    task('p-billing', 'Reconciliation report', 'in_progress', 'medium', 'm-sara', 3, 2),
    task('p-billing', 'Cut-over runbook', 'todo', 'high', 'm-jon', 3, 3),
    task('p-billing', 'Customer comms for card re-entry', 'todo', 'medium', null, 2, 7),

    task('p-infra', 'Pick a tracing backend', 'done', 'medium', 'm-jon', 3, 30),
    task('p-infra', 'Instrument the API gateway', 'in_progress', 'medium', 'm-jon', 5, 9),
    task('p-infra', 'Log retention policy', 'todo', 'low', 'm-mei', 2, 12),
    task('p-infra', 'On-call dashboard templates', 'todo', 'medium', null, 5, 12),

    task('p-search', 'Collect a relevance test set', 'in_progress', 'medium', 'm-ava', 3, 2),
    task('p-search', 'Benchmark embedding models', 'todo', 'medium', 'm-mei', 5, 3),
    task('p-search', 'Draft the evaluation rubric', 'todo', 'low', 'm-ava', 2, 4),

    task('p-docs', 'Information architecture', 'done', 'medium', 'm-leo', 3, 40),
    task('p-docs', 'API reference generator', 'done', 'high', 'm-noah', 8, 28),
    task('p-docs', 'Versioned navigation', 'done', 'medium', 'm-noah', 5, 22),
    task('p-docs', 'Launch checklist', 'done', 'low', 'm-leo', 1, 18),
  ];

  let activityNumber = 0;
  const activity = (type, message, projectId, hoursAgo) => {
    activityNumber += 1;
    return {
      id: `a-${String(activityNumber).padStart(3, '0')}`,
      type,
      message,
      projectId,
      createdAt: timestamp(-hoursAgo / 24),
    };
  };

  // Newest first.
  const activityLog = [
    activity('task.moved', '“Pricing page layout” moved to In progress', 'p-web', 5),
    activity('task.moved', '“Dual-write subscriptions” moved to In review', 'p-billing', 14),
    activity('task.moved', '“Backfill invoices” moved to In progress', 'p-billing', 19),
    activity('task.moved', '“Build the new landing hero” moved to In review', 'p-web', 24),
    activity('task.created', '“Collect a relevance test set” added to Search relevance', 'p-search', 48),
    activity('project.created', 'Project “Search relevance” created', 'p-search', 144),
    activity('project.updated', 'Project “Observability rollout” was paused', 'p-infra', 216),
    activity('task.moved', '“Launch checklist” moved to Done', 'p-docs', 432),
  ];

  const settings = {
    workspaceName: 'Northwind Studio',
    dateFormat: 'medium',
    defaultProjectSort: 'updated',
    showCompletedTasks: true,
    wipLimit: 2,
    activityFeedSize: 6,
  };

  return { members, projects, tasks, activity: activityLog, settings };
}

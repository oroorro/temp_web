import { Router } from 'express';
import { dashboardRouter } from './dashboard.routes.js';
import { membersRouter } from './members.routes.js';
import { projectsRouter } from './projects.routes.js';
import { settingsRouter } from './settings.routes.js';
import { tasksRouter } from './tasks.routes.js';
import { teamRouter } from './team.routes.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

apiRouter.use('/dashboard', dashboardRouter);
apiRouter.use('/projects', projectsRouter);
apiRouter.use('/tasks', tasksRouter);
apiRouter.use('/members', membersRouter);
apiRouter.use('/team', teamRouter);
apiRouter.use('/settings', settingsRouter);

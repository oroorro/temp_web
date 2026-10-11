import { Router } from 'express';
import * as projects from '../controllers/projects.controller.js';
import * as tasks from '../controllers/tasks.controller.js';
import { validateBody } from '../middleware/validate.js';
import { projectRules } from '../schemas/project.schema.js';
import { taskRules } from '../schemas/task.schema.js';

export const projectsRouter = Router();

projectsRouter.get('/', projects.list);
projectsRouter.post('/', validateBody(projectRules), projects.create);
projectsRouter.get('/:projectId', projects.get);
projectsRouter.patch('/:projectId', validateBody(projectRules, { partial: true }), projects.update);

projectsRouter.get('/:projectId/tasks', tasks.listForProject);
projectsRouter.post('/:projectId/tasks', validateBody(taskRules), tasks.create);

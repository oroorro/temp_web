import { Router } from 'express';
import * as tasks from '../controllers/tasks.controller.js';
import { validateBody } from '../middleware/validate.js';
import { taskRules } from '../schemas/task.schema.js';

export const tasksRouter = Router();

tasksRouter.patch('/:taskId', validateBody(taskRules, { partial: true }), tasks.update);
tasksRouter.delete('/:taskId', tasks.remove);

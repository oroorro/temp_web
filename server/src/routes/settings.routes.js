import { Router } from 'express';
import * as settings from '../controllers/settings.controller.js';
import { validateBody } from '../middleware/validate.js';
import { settingsRules } from '../schemas/settings.schema.js';

export const settingsRouter = Router();

settingsRouter.get('/', settings.get);
settingsRouter.put('/', validateBody(settingsRules), settings.update);

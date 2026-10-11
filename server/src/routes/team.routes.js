import { Router } from 'express';
import * as team from '../controllers/team.controller.js';

export const teamRouter = Router();

teamRouter.get('/', team.overview);

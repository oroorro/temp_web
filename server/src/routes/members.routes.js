import { Router } from 'express';
import * as members from '../controllers/members.controller.js';

export const membersRouter = Router();

membersRouter.get('/', members.list);

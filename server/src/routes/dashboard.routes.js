import { Router } from 'express';
import * as dashboard from '../controllers/dashboard.controller.js';

export const dashboardRouter = Router();

dashboardRouter.get('/summary', dashboard.summary);
dashboardRouter.get('/activity', dashboard.activity);

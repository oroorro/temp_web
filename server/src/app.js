import express from 'express';
import { config } from './config.js';
import { delay } from './middleware/delay.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { apiRouter } from './routes/index.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json());
  app.use(requestLogger);

  app.use('/api', delay(config.delayMs), apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

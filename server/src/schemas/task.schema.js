import { TASK_PRIORITIES, TASK_STATUSES } from '../constants.js';

export const taskRules = {
  title: { type: 'string', required: true, maxLength: 120 },
  description: { type: 'string', maxLength: 500 },
  status: { type: 'string', enum: TASK_STATUSES },
  priority: { type: 'string', enum: TASK_PRIORITIES },
  assigneeId: { type: 'string', nullable: true },
  estimate: { type: 'number', integer: true, min: 0, max: 100 },
};

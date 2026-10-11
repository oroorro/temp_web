import { PROJECT_STATUSES } from '../constants.js';

export const projectRules = {
  name: { type: 'string', required: true, maxLength: 80 },
  description: { type: 'string', maxLength: 500 },
  status: { type: 'string', enum: PROJECT_STATUSES },
  ownerId: { type: 'string', required: true },
  memberIds: { type: 'stringArray' },
  tags: { type: 'stringArray' },
  dueDate: { type: 'string', nullable: true, pattern: /^\d{4}-\d{2}-\d{2}$/ },
};

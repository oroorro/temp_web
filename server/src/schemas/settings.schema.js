import { DATE_FORMATS, PROJECT_SORTS } from '../constants.js';

export const settingsRules = {
  workspaceName: { type: 'string', required: true, maxLength: 40 },
  dateFormat: { type: 'string', required: true, enum: DATE_FORMATS },
  defaultProjectSort: { type: 'string', required: true, enum: PROJECT_SORTS },
  showCompletedTasks: { type: 'boolean', required: true },
  wipLimit: { type: 'number', required: true, integer: true, min: 0, max: 20 },
  activityFeedSize: { type: 'number', required: true, integer: true, min: 3, max: 20 },
};

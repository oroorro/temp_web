import type { WorkspaceSettings } from '../types/domain';
import { isWholeNumberBetween } from './formLogic';
import type { FormErrors } from './formLogic';

/** Used until the saved settings arrive from the API. */
export const DEFAULT_SETTINGS: WorkspaceSettings = {
  workspaceName: 'Workspace',
  dateFormat: 'medium',
  defaultProjectSort: 'updated',
  showCompletedTasks: true,
  wipLimit: 0,
  activityFeedSize: 6,
};

const MAX_WORKSPACE_NAME_LENGTH = 40;

export function withDefaults(saved: WorkspaceSettings | undefined): WorkspaceSettings {
  return saved ? { ...DEFAULT_SETTINGS, ...saved } : DEFAULT_SETTINGS;
}

export function validateSettings(values: WorkspaceSettings): FormErrors {
  const errors: FormErrors = {};
  const name = values.workspaceName.trim();

  if (name === '') errors.workspaceName = 'The workspace needs a name';
  else if (name.length > MAX_WORKSPACE_NAME_LENGTH) {
    errors.workspaceName = `Keep the name under ${MAX_WORKSPACE_NAME_LENGTH} characters`;
  }
  if (!isWholeNumberBetween(values.wipLimit, 0, 20)) {
    errors.wipLimit = 'Enter a whole number from 0 to 20';
  }
  if (!isWholeNumberBetween(values.activityFeedSize, 3, 20)) {
    errors.activityFeedSize = 'Enter a whole number from 3 to 20';
  }
  return errors;
}

export function normalizeSettings(values: WorkspaceSettings): WorkspaceSettings {
  return { ...values, workspaceName: values.workspaceName.trim() };
}

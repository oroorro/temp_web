import { db } from '../data/db.js';
import { recordActivity } from './activity.service.js';

export function getSettings() {
  return db.settings;
}

export function updateSettings(next) {
  db.settings = { ...db.settings, ...next };
  recordActivity('settings.updated', 'Workspace settings were updated');
  return db.settings;
}

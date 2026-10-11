import { db } from '../data/db.js';
import { createId } from '../utils/id.js';

const MAX_ENTRIES = 100;

export function recordActivity(type, message, projectId = null) {
  db.activity.unshift({
    id: createId('a'),
    type,
    message,
    projectId,
    createdAt: new Date().toISOString(),
  });
  db.activity.length = Math.min(db.activity.length, MAX_ENTRIES);
}

export function listActivity(limit) {
  return db.activity.slice(0, limit);
}

import { listActivity } from '../services/activity.service.js';
import { getSummary } from '../services/dashboard.service.js';
import { intParam } from '../utils/query.js';

export function summary(_req, res) {
  res.json(getSummary());
}

export function activity(req, res) {
  const limit = intParam(req.query, 'limit', { fallback: 8, min: 1, max: 50 });
  res.json(listActivity(limit));
}

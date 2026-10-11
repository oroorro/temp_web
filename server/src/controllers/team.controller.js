import { getTeam } from '../services/team.service.js';

export function overview(_req, res) {
  res.json(getTeam());
}

import { listMembers } from '../services/members.service.js';

export function list(_req, res) {
  res.json(listMembers());
}

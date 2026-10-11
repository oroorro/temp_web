import { db } from '../data/db.js';
import { badRequest } from '../utils/httpError.js';

export function listMembers() {
  return db.members;
}

export function findMember(id) {
  return db.members.find((member) => member.id === id);
}

/** Throws a 400 when `id` does not refer to a known member. */
export function assertMember(id, field) {
  if (!findMember(id)) throw badRequest(`${field} does not match a known member`);
}

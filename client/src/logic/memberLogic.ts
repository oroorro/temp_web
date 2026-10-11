import type { Member } from '../types/domain';
import type { Option } from '../types/ui';

export type MembersById = Record<string, Member>;

export function indexMembers(members: Member[]): MembersById {
  return Object.fromEntries(members.map((member) => [member.id, member]));
}

/** Looks up members by id, silently skipping ids that are not loaded (yet). */
export function resolveMembers(ids: string[], membersById: MembersById): Member[] {
  return ids.flatMap((id) => membersById[id] ?? []);
}

export function toMemberOptions(members: Member[]): Option[] {
  return members.map((member) => ({ value: member.id, label: `${member.name} — ${member.role}` }));
}

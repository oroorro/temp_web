import { useMemo } from 'react';
import { keys } from '../../api/keys';
import { fetchMembers } from '../../api/workspace';
import { indexMembers } from '../../logic/memberLogic';
import type { Member } from '../../types/domain';
import { useResource } from '../core/useResource';

const MEMBERS_STALE_MS = 5 * 60_000;
const NO_MEMBERS: Member[] = [];

export function useMembers() {
  const resource = useResource(keys.members(), fetchMembers, { staleMs: MEMBERS_STALE_MS });
  const members = resource.data ?? NO_MEMBERS;
  const membersById = useMemo(() => indexMembers(members), [members]);

  return { members, membersById, isLoading: resource.isLoading, error: resource.error };
}

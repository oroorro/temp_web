import { keys } from '../../api/keys';
import { fetchTeam } from '../../api/team';
import { useResource } from '../core/useResource';

/** Every member with their projects and tasks. The key is constant, so no view option can cause another request. */
export function useTeam() {
  return useResource(keys.team(), fetchTeam);
}

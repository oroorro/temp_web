import { useMemo } from 'react';
import { keys } from '../../api/keys';
import { fetchSettings } from '../../api/workspace';
import { withDefaults } from '../../logic/settingsLogic';
import { useResource } from '../core/useResource';

const SETTINGS_STALE_MS = 5 * 60_000;

/** Workspace settings, falling back to defaults until the saved ones have loaded. */
export function useWorkspaceSettings() {
  const resource = useResource(keys.settings(), fetchSettings, { staleMs: SETTINGS_STALE_MS });
  const settings = useMemo(() => withDefaults(resource.data), [resource.data]);

  return {
    settings,
    /** The settings exactly as saved on the server; `undefined` while loading. */
    saved: resource.data,
    isLoading: resource.isLoading,
    error: resource.error,
    refetch: resource.refetch,
  };
}

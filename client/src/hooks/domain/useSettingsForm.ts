import { useCallback, useEffect } from 'react';
import { invalidation, keys } from '../../api/keys';
import { updateSettings } from '../../api/workspace';
import { normalizeSettings, validateSettings } from '../../logic/settingsLogic';
import { useResourceStore } from '../../store/resourceStore';
import { useFormState } from '../core/useFormState';
import { useMutation } from '../core/useMutation';
import { useWorkspaceSettings } from './useWorkspaceSettings';

/** Form state for the Settings page, kept in sync with the saved settings. */
export function useSettingsForm() {
  const { settings, saved, isLoading, error, refetch } = useWorkspaceSettings();
  const form = useFormState(settings, validateSettings);

  // Adopt the saved settings as the baseline when they load and after each save.
  const { reset, submit: validateForm } = form;
  useEffect(() => {
    if (saved) reset(saved);
  }, [saved, reset]);

  const { mutate, isPending } = useMutation(updateSettings, {
    invalidates: invalidation.settingsChanged(),
    successMessage: 'Settings saved',
    // The response is the new truth; put it in the cache instead of refetching.
    onSuccess: (result) => useResourceStore.getState().setData(keys.settings(), result),
  });

  const save = useCallback(() => {
    const values = validateForm();
    if (values) void mutate(normalizeSettings(values));
  }, [validateForm, mutate]);

  const discard = useCallback(() => reset(), [reset]);

  return {
    form,
    save,
    discard,
    isSaving: isPending,
    isLoading,
    error: saved ? null : error,
    refetch,
  };
}

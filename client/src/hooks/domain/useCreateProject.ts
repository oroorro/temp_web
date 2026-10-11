import { useCallback, useMemo } from 'react';
import { invalidation } from '../../api/keys';
import { createProject } from '../../api/projects';
import { PROJECT_STATUS_OPTIONS } from '../../logic/labels';
import { toMemberOptions } from '../../logic/memberLogic';
import { EMPTY_PROJECT_DRAFT, toNewProjectInput, validateProjectDraft } from '../../logic/projectLogic';
import type { Project } from '../../types/domain';
import { useFormState } from '../core/useFormState';
import { useMutation } from '../core/useMutation';
import { useMembers } from './useMembers';

/** State and submit handler for the "New project" dialog. */
export function useCreateProject(onCreated: (project: Project) => void) {
  const { members } = useMembers();
  const form = useFormState(EMPTY_PROJECT_DRAFT, validateProjectDraft);
  const { mutate, isPending } = useMutation(createProject, {
    invalidates: invalidation.projectChanged(),
    successMessage: (project) => `Created “${project.name}”`,
    onSuccess: onCreated,
  });

  const { submit: validateForm } = form;
  const submit = useCallback(() => {
    const draft = validateForm();
    if (draft) void mutate(toNewProjectInput(draft));
  }, [validateForm, mutate]);

  // Lists that `project.form.json` binds its dropdowns to.
  const scope = useMemo(
    () => ({ memberOptions: toMemberOptions(members), statusOptions: PROJECT_STATUS_OPTIONS }),
    [members],
  );

  return { form, scope, submit, isSaving: isPending };
}

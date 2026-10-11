import { useCreateProject } from '../../hooks/domain/useCreateProject';
import type { Project } from '../../types/domain';
import { SchemaRenderer } from '../../ui-schema/SchemaRenderer';
import { projectForm } from '../../ui-schema/declarations';
import { Button } from '../common/Button';
import { Dialog } from '../common/Dialog';
import { FormProvider } from '../form/FormProvider';

interface NewProjectDialogProps {
  onClose: () => void;
  onCreated: (project: Project) => void;
}

/** The fields come from `project.form.json`; this component only wires them to the form state. */
export function NewProjectDialog({ onClose, onCreated }: NewProjectDialogProps) {
  const { form, scope, submit, isSaving } = useCreateProject(onCreated);

  return (
    <Dialog
      title="New project"
      onClose={onClose}
      onSubmit={submit}
      footer={
        <>
          <Button label="Cancel" variant="ghost" onClick={onClose} />
          <Button label={isSaving ? 'Creating…' : 'Create project'} type="submit" disabled={isSaving} />
        </>
      }
    >
      <FormProvider form={form} disabled={isSaving}>
        <SchemaRenderer declaration={projectForm} scope={scope} />
      </FormProvider>
    </Dialog>
  );
}

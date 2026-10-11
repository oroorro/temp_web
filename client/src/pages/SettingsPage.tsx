import { AsyncBoundary } from '../components/common/AsyncBoundary';
import { Button } from '../components/common/Button';
import { FormProvider } from '../components/form/FormProvider';
import { PageContainer } from '../components/layout/PageContainer';
import { useSettingsForm } from '../hooks/domain/useSettingsForm';
import { SchemaRenderer } from '../ui-schema/SchemaRenderer';
import { settingsForm } from '../ui-schema/declarations';

/** The fields are declared in `settings.form.json` and rendered through the component registry. */
export function SettingsPage() {
  const { form, save, discard, isSaving, isLoading, error, refetch } = useSettingsForm();
  const canSave = form.isDirty && !isSaving;

  return (
    <PageContainer
      title="Settings"
      subtitle="Preferences for this workspace"
      actions={
        <>
          <Button label="Discard" variant="ghost" disabled={!canSave} onClick={discard} />
          <Button label={isSaving ? 'Saving…' : 'Save changes'} disabled={!canSave} onClick={save} />
        </>
      }
    >
      <AsyncBoundary isLoading={isLoading} error={error} onRetry={refetch}>
        <FormProvider form={form} disabled={isSaving}>
          <SchemaRenderer declaration={settingsForm} />
        </FormProvider>
      </AsyncBoundary>
    </PageContainer>
  );
}

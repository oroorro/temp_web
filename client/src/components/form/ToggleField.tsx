import { useFormField } from '../../hooks/core/useFormField';
import { FieldShell, describedBy } from './FieldShell';

interface ToggleFieldProps {
  name: string;
  label: string;
  help?: string;
}

export function ToggleField({ name, label, help }: ToggleFieldProps) {
  const field = useFormField(name);

  return (
    <FieldShell id={field.id} label={label} help={help} error={field.error} inline>
      <input
        id={field.id}
        className="toggle"
        type="checkbox"
        role="switch"
        checked={field.value === true}
        disabled={field.disabled}
        aria-describedby={describedBy(field.id, help, field.error)}
        onChange={(event) => field.onChange(event.target.checked)}
        onBlur={field.onBlur}
      />
    </FieldShell>
  );
}

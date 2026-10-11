import { useFormField } from '../../hooks/core/useFormField';
import { asText, parseNumberInput } from '../../logic/formLogic';
import { FieldShell, describedBy } from './FieldShell';

interface NumberFieldProps {
  name: string;
  label: string;
  help?: string;
  min?: number;
  max?: number;
}

export function NumberField({ name, label, help, min, max }: NumberFieldProps) {
  const field = useFormField(name);

  return (
    <FieldShell id={field.id} label={label} help={help} error={field.error}>
      <input
        id={field.id}
        className="control control--narrow"
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={1}
        value={asText(field.value)}
        disabled={field.disabled}
        aria-invalid={field.error ? true : undefined}
        aria-describedby={describedBy(field.id, help, field.error)}
        onChange={(event) => field.onChange(parseNumberInput(event.target.value))}
        onBlur={field.onBlur}
      />
    </FieldShell>
  );
}

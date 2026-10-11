import { useFormField } from '../../hooks/core/useFormField';
import { asText } from '../../logic/formLogic';
import type { Option } from '../../types/ui';
import { FieldShell, describedBy } from './FieldShell';

interface SelectFieldProps {
  name: string;
  label: string;
  help?: string;
  options: Option[];
  /** Adds an empty first choice with this text. */
  placeholder?: string;
}

export function SelectField({ name, label, help, options, placeholder }: SelectFieldProps) {
  const field = useFormField(name);

  return (
    <FieldShell id={field.id} label={label} help={help} error={field.error}>
      <select
        id={field.id}
        className="control"
        value={asText(field.value)}
        disabled={field.disabled}
        aria-invalid={field.error ? true : undefined}
        aria-describedby={describedBy(field.id, help, field.error)}
        onChange={(event) => field.onChange(event.target.value)}
        onBlur={field.onBlur}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

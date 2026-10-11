import { useFormField } from '../../hooks/core/useFormField';
import { asText } from '../../logic/formLogic';
import { FieldShell, describedBy } from './FieldShell';

interface TextFieldProps {
  name: string;
  label: string;
  help?: string;
  placeholder?: string;
  inputType?: 'text' | 'date';
  multiline?: boolean;
}

export function TextField({ name, label, help, placeholder, inputType = 'text', multiline = false }: TextFieldProps) {
  const field = useFormField(name);
  const shared = {
    id: field.id,
    className: 'control',
    value: asText(field.value),
    placeholder,
    disabled: field.disabled,
    'aria-invalid': field.error ? true : undefined,
    'aria-describedby': describedBy(field.id, help, field.error),
    onBlur: field.onBlur,
  };

  return (
    <FieldShell id={field.id} label={label} help={help} error={field.error}>
      {multiline ? (
        <textarea {...shared} rows={3} onChange={(event) => field.onChange(event.target.value)} />
      ) : (
        <input {...shared} type={inputType} onChange={(event) => field.onChange(event.target.value)} />
      )}
    </FieldShell>
  );
}

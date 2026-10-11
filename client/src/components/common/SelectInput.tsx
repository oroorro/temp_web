import type { Option } from '../../types/ui';

interface SelectInputProps<T extends string> {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
}

/** Compact labelled dropdown for toolbars. Form fields use `SelectField` instead. */
export function SelectInput<T extends string>({ label, value, options, onChange }: SelectInputProps<T>) {
  return (
    <label className="select-input">
      <span className="select-input__label">{label}</span>
      <select className="control" value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

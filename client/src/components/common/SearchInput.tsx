import { Icon } from './Icon';

interface SearchInputProps {
  value: string;
  /** Accessible name; also used as the placeholder. */
  label: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, label, onChange }: SearchInputProps) {
  return (
    <label className="search-input">
      <Icon name="search" size={16} />
      <input
        type="search"
        value={value}
        placeholder={label}
        aria-label={label}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

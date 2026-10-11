import { initials } from '../../logic/formatters';

interface AvatarProps {
  name: string;
  color: string;
  size?: 'sm' | 'md';
}

export function Avatar({ name, color, size = 'md' }: AvatarProps) {
  return (
    <span className={`avatar avatar--${size}`} style={{ backgroundColor: color }} title={name} aria-label={name} role="img">
      {initials(name)}
    </span>
  );
}

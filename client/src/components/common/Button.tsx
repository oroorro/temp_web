import { cx } from '../../logic/classNames';
import type { IconName } from '../../types/ui';
import { Icon } from './Icon';

export interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  icon?: IconName;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  type = 'button',
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx('btn', `btn--${variant}`, `btn--${size}`)}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <Icon name={icon} size={16} />}
      {label}
    </button>
  );
}

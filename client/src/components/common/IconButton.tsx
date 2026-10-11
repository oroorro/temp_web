import { cx } from '../../logic/classNames';
import type { IconName } from '../../types/ui';
import { Icon } from './Icon';

interface IconButtonProps {
  icon: IconName;
  /** Accessible name; also shown as the tooltip. */
  label: string;
  tone?: 'default' | 'danger';
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
}

export function IconButton({
  icon,
  label,
  tone = 'default',
  type = 'button',
  disabled = false,
  onClick,
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cx('icon-btn', tone === 'danger' && 'icon-btn--danger')}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon name={icon} size={16} />
    </button>
  );
}

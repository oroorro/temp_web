import type { ReactNode } from 'react';
import { cx } from '../../logic/classNames';

interface FieldShellProps {
  /** Id of the control inside, so the label points at it. */
  id: string;
  label: string;
  help?: string;
  error?: string;
  /** Puts the control next to the label instead of below it (used by toggles). */
  inline?: boolean;
  children: ReactNode;
}

/** Label, help text and error message around a single form control. */
export function FieldShell({ id, label, help, error, inline = false, children }: FieldShellProps) {
  return (
    <div className={cx('field', inline && 'field--inline', error && 'field--invalid')}>
      <div className="field__text">
        <label className="field__label" htmlFor={id}>
          {label}
        </label>
        {help && (
          <p className="field__help" id={`${id}-help`}>
            {help}
          </p>
        )}
      </div>
      {children}
      {error && (
        <p className="field__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** `aria-describedby` value matching the ids rendered by `FieldShell`. */
export function describedBy(id: string, help?: string, error?: string): string | undefined {
  return cx(help && `${id}-help`, error && `${id}-error`) || undefined;
}

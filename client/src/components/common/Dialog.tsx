import { useEffect, useId, useRef } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { IconButton } from './IconButton';

interface DialogProps {
  title: string;
  onClose: () => void;
  /** Called when the form inside the dialog is submitted (Enter or a submit button). */
  onSubmit: () => void;
  /** Buttons shown at the bottom; include one with `type="submit"`. */
  footer: ReactNode;
  children: ReactNode;
}

/** Modal form dialog. Mount it to open it, unmount it to close it. */
export function Dialog({ title, onClose, onSubmit, footer, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    // Escape fires `cancel`; routing it through onClose lets the parent unmount the dialog.
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <form className="dialog__form" onSubmit={handleSubmit} noValidate>
        <header className="dialog__header">
          <h2 id={titleId}>{title}</h2>
          <IconButton icon="close" label="Close" onClick={onClose} />
        </header>
        <div className="dialog__body">{children}</div>
        <footer className="dialog__footer">{footer}</footer>
      </form>
    </dialog>
  );
}

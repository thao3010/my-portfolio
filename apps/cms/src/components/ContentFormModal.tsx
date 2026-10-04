import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './ui/Button';

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  formId: string;
  saving?: boolean;
  submitLabel?: string;
};

export function ContentFormModal({
  open,
  title,
  onClose,
  children,
  formId,
  saving = false,
  submitLabel,
}: Props) {
  if (!open) {
    return null;
  }

  const saveLabel = submitLabel ?? 'Save';

  return createPortal(
    <div
      className="content-modal-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="content-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="content-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="content-modal-header">
          <h2 id="content-modal-title">{title}</h2>
          <button
            type="button"
            className="content-modal-close"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="content-modal-body">{children}</div>
        <footer className="content-modal-footer content-modal-footer--end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={formId} loading={saving}>
            {saveLabel}
          </Button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

import type { ReactNode } from 'react';
import { Button } from './ui/Button';

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M4 7h16M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M6.5 7l.8 12.2A1.5 1.5 0 0 0 8.8 20.5h6.4a1.5 1.5 0 0 0 1.5-1.3L17.5 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 11v6M14 11v6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

type Props = {
  onEdit: () => void;
  onDelete: () => void;
  deleteLabel: string;
  children: ReactNode;
  className?: string;
};

export function ContentEntryRow({
  onEdit,
  onDelete,
  deleteLabel,
  children,
  className = '',
}: Props) {
  return (
    <li className="content-entry-row">
      <button
        type="button"
        className={`content-entry-card card-panel${className ? ` ${className}` : ''}`}
        onClick={onEdit}
      >
        {children}
      </button>
      <Button
        type="button"
        variant="ghost"
        className="content-entry-delete"
        aria-label={deleteLabel}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <TrashIcon />
      </Button>
    </li>
  );
}

import type { ReactNode } from 'react';
import { Button } from './ui/Button';

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
        Delete
      </Button>
    </li>
  );
}

import type { InputHTMLAttributes } from 'react';
import { Input } from './Input';

/** ISO or empty string ↔ native datetime-local */
function toLocalInput(iso?: string): string {
  if (!iso) {
    return '';
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromLocalInput(value: string): string {
  if (!value) {
    return '';
  }
  return new Date(value).toISOString();
}

export type DateTimeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange'
> & {
  value?: string;
  onValueChange: (iso: string) => void;
};

export function DateTimeInput({
  value,
  onValueChange,
  className,
  ...props
}: DateTimeInputProps) {
  return (
    <Input
      type="datetime-local"
      className={className}
      value={toLocalInput(value)}
      onChange={(e) => onValueChange(fromLocalInput(e.target.value))}
      {...props}
    />
  );
}

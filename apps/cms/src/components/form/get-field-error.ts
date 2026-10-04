import type { FieldErrors, FieldValues } from 'react-hook-form';

export function getFieldError(
  errors: FieldErrors<FieldValues>,
  name: string,
): string | undefined {
  const parts = name.split('.');
  let current: unknown = errors;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  if (current && typeof current === 'object' && 'message' in current) {
    const message = (current as { message?: unknown }).message;
    return typeof message === 'string' ? message : undefined;
  }
  return undefined;
}

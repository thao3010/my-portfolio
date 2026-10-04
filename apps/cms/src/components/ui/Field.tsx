import type { ReactNode } from 'react';

type FieldProps = {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  shell?: 'auth' | 'default';
  className?: string;
  children: ReactNode;
};

export function Field({
  label,
  htmlFor,
  hint,
  error,
  shell = 'default',
  className = '',
  children,
}: FieldProps) {
  const control =
    shell === 'auth' ? (
      <div className="auth-input-shell">{children}</div>
    ) : (
      <div className="ui-control">{children}</div>
    );

  return (
    <div
      className={`form-field ui-field${error ? ' ui-field--error' : ''}${shell === 'auth' ? ' auth-field' : ''} ${className}`.trim()}
    >
      {label ? (
        <label htmlFor={htmlFor} className="ui-label">
          {label}
        </label>
      ) : null}
      {control}
      {hint ? <span className="ui-hint">{hint}</span> : null}
      {error ? (
        <span className="ui-error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

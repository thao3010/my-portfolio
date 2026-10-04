import { useFormContext } from 'react-hook-form';
import { Field } from '../ui/Field';
import { getFieldError } from './get-field-error';

type RhfSelectProps = {
  name: string;
  label: string;
  hint?: string;
  shell?: 'auth' | 'default';
  children: React.ReactNode;
};

export function RhfSelect({
  name,
  label,
  hint,
  shell = 'default',
  children,
}: RhfSelectProps) {
  const { register, formState } = useFormContext();
  const error = getFieldError(formState.errors, name);

  return (
    <Field label={label} htmlFor={name} hint={hint} error={error} shell={shell}>
      <select id={name} className="ui-input" {...register(name)}>
        {children}
      </select>
    </Field>
  );
}

import { useFormContext } from 'react-hook-form';
import { Field } from '../ui/Field';
import { Input, type InputProps } from '../ui/Input';
import { getFieldError } from './get-field-error';

type RhfInputProps = Omit<InputProps, 'name'> & {
  name: string;
  label: string;
  hint?: string;
  shell?: 'auth' | 'default';
};

export function RhfInput({
  name,
  label,
  hint,
  shell = 'default',
  id,
  ...inputProps
}: RhfInputProps) {
  const { register, formState } = useFormContext();
  const fieldId = id ?? name;
  const error = getFieldError(formState.errors, name);

  return (
    <Field
      label={label}
      htmlFor={fieldId}
      hint={hint}
      error={error}
      shell={shell}
    >
      <Input id={fieldId} {...register(name)} {...inputProps} />
    </Field>
  );
}

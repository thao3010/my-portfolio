import { useFormContext } from 'react-hook-form';
import { Field } from '../ui/Field';
import { Textarea, type TextareaProps } from '../ui/Textarea';
import { getFieldError } from './get-field-error';

type RhfTextareaProps = Omit<TextareaProps, 'name'> & {
  name: string;
  label: string;
  hint?: string;
};

export function RhfTextarea({ name, label, hint, id, ...props }: RhfTextareaProps) {
  const { register, formState } = useFormContext();
  const fieldId = id ?? name;
  const error = getFieldError(formState.errors, name);

  return (
    <Field label={label} htmlFor={fieldId} hint={hint} error={error}>
      <Textarea id={fieldId} {...register(name)} {...props} />
    </Field>
  );
}

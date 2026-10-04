import { Controller, useFormContext } from 'react-hook-form';
import { Field } from '../ui/Field';
import { RichTextEditor } from '../ui/RichTextEditor';
import { getFieldError } from './get-field-error';

type RhfRichTextProps = {
  name: string;
  label: string;
  hint?: string;
  placeholder?: string;
};

export function RhfRichText({
  name,
  label,
  hint,
  placeholder,
}: RhfRichTextProps) {
  const { control, formState } = useFormContext();
  const error = getFieldError(formState.errors, name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Field label={label} htmlFor={name} hint={hint} error={error}>
          <RichTextEditor
            id={name}
            value={(field.value as string) ?? ''}
            onChange={field.onChange}
            placeholder={placeholder}
          />
        </Field>
      )}
    />
  );
}

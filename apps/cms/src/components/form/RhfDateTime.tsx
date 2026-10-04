import { Controller, useFormContext } from 'react-hook-form';
import { DateTimeInput } from '../ui/DateTimeInput';
import { Field } from '../ui/Field';
import { getFieldError } from './get-field-error';

type RhfDateTimeProps = {
  name: string;
  label: string;
  hint?: string;
};

export function RhfDateTime({ name, label, hint }: RhfDateTimeProps) {
  const { control, formState } = useFormContext();
  const error = getFieldError(formState.errors, name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Field label={label} htmlFor={name} hint={hint} error={error}>
          <DateTimeInput
            id={name}
            value={field.value as string | undefined}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
          />
        </Field>
      )}
    />
  );
}

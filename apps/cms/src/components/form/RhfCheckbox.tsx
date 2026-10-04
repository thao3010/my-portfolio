import { useFormContext } from 'react-hook-form';
import { getFieldError } from './get-field-error';

type RhfCheckboxProps = {
  name: string;
  label: string;
};

export function RhfCheckbox({ name, label }: RhfCheckboxProps) {
  const { register, formState } = useFormContext();
  const error = getFieldError(formState.errors, name);

  return (
    <label className="checkbox-row ui-checkbox">
      <input type="checkbox" {...register(name)} />
      <span>{label}</span>
      {error ? (
        <span className="ui-error" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

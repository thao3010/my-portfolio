import type { SkillIconPreset } from '@portfolio/shared';
import { Controller, useFormContext } from 'react-hook-form';
import { SkillIconPicker } from '../SkillIconPicker';
import { Field } from '../ui/Field';
import { getFieldError } from './get-field-error';

type RhfSkillIconProps = {
  name: string;
  label: string;
  presets: SkillIconPreset[];
  onUpload: (file: File) => Promise<string>;
  disabled?: boolean;
};

export function RhfSkillIcon({
  name,
  label,
  presets,
  onUpload,
  disabled,
}: RhfSkillIconProps) {
  const { control, formState } = useFormContext();
  const error = getFieldError(formState.errors, name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Field label={label} error={error}>
          <SkillIconPicker
            value={(field.value as string) ?? ''}
            onChange={field.onChange}
            presets={presets}
            onUpload={onUpload}
            disabled={disabled}
          />
        </Field>
      )}
    />
  );
}

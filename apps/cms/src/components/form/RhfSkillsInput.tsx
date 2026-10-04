import { useFormContext } from 'react-hook-form';
import { Field } from '../ui/Field';
import { Input } from '../ui/Input';

type RhfSkillsInputProps = {
  name: string;
  label: string;
  hint?: string;
};

export function RhfSkillsInput({ name, label, hint }: RhfSkillsInputProps) {
  const { watch, setValue, formState } = useFormContext();
  const skills = (watch(name) as string[] | undefined) ?? [];
  const text = skills.join(', ');

  return (
    <Field label={label} hint={hint}>
      <Input
        value={text}
        onChange={(e) =>
          setValue(
            name,
            e.target.value
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
            { shouldDirty: true, shouldValidate: true },
          )
        }
      />
      {formState.errors[name] ? (
        <span className="ui-error" role="alert">
          Invalid skills
        </span>
      ) : null}
    </Field>
  );
}

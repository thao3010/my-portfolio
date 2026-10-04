import { useFormContext } from 'react-hook-form';
import { Field } from '../ui/Field';
import { Input } from '../ui/Input';

type RhfCommaListProps = {
  name: string;
  label: string;
  hint?: string;
  placeholder?: string;
};

export function RhfCommaList({
  name,
  label,
  hint,
  placeholder,
}: RhfCommaListProps) {
  const { watch, setValue } = useFormContext();
  const items = (watch(name) as string[] | undefined) ?? [];

  return (
    <Field label={label} hint={hint}>
      <Input
        placeholder={placeholder}
        value={items.join(', ')}
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
    </Field>
  );
}

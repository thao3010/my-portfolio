import type { SkillIconPreset } from '@portfolio/shared';
import { RhfInput, RhfSkillIcon, RhfTextarea } from '../form';

type Props = {
  presets: SkillIconPreset[];
  onUpload: (file: File) => Promise<string>;
  saving?: boolean;
};

export function SkillContentFields({ presets, onUpload, saving }: Props) {
  return (
    <>
      <RhfInput
        name="title"
        label="Title"
        placeholder="e.g. React"
        maxLength={120}
      />
      <RhfTextarea
        name="description"
        label="Description"
        placeholder="Short summary of your experience"
        rows={4}
        maxLength={2000}
      />
      <RhfSkillIcon
        name="icon"
        label="Icon"
        presets={presets}
        onUpload={onUpload}
        disabled={saving}
      />
    </>
  );
}

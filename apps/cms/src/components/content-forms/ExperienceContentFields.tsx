import { RhfInput, RhfRichText } from '../form';

export function ExperienceContentFields() {
  return (
    <>
      <RhfInput name="company" label="Company" />
      <RhfInput name="title" label="Title" />
      <RhfInput
        name="period"
        label="Period"
        placeholder="2022 — Present"
      />
      <RhfRichText name="description" label="Description" />
    </>
  );
}

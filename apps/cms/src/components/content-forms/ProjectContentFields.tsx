import { RhfInput, RhfRichText, RhfTextarea } from '../form';

export function ProjectContentFields() {
  return (
    <>
      <RhfInput name="title" label="Title" />
      <RhfInput name="url" label="URL" type="url" />
      <RhfRichText name="description" label="Description" />
      <RhfTextarea
        name="tech"
        label="Tech stack"
        placeholder="React, TypeScript"
        rows={2}
      />
    </>
  );
}

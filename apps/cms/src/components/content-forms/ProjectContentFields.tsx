import { RhfInput, RhfRichText, RhfTextarea } from '../form';

export function ProjectContentFields() {
  return (
    <>
      <RhfInput name="title" label="Title" />
      <RhfInput
        name="period"
        label="Period"
        placeholder="2023 — 2024"
      />
      <RhfInput name="url" label="URL" type="url" />
      <RhfTextarea
        name="description"
        label="Description"
        placeholder="Short summary shown on the card"
        rows={3}
      />
      <RhfRichText name="content" label="Content" />
      <RhfTextarea
        name="tech"
        label="Tech stack"
        placeholder="React, TypeScript"
        rows={2}
      />
    </>
  );
}

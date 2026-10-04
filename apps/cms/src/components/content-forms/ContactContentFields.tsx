import { CONTACT_FORM_FIELDS } from '../../schemas/content.schema';
import { RhfInput } from '../form';

export function ContactContentFields() {
  return (
    <>
      <RhfInput name="label" label="Label" placeholder="Primary" />
      {CONTACT_FORM_FIELDS.map((key) => (
        <RhfInput
          key={key}
          name={key}
          label={key}
          autoComplete="off"
          type={key === 'email' ? 'email' : key === 'website' ? 'url' : 'text'}
        />
      ))}
    </>
  );
}

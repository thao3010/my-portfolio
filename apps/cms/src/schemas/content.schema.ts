import { z } from 'zod';

export const experienceFormSchema = z.object({
  company: z.string().trim().min(1, 'Company is required'),
  title: z.string().trim().min(1, 'Title is required'),
  period: z.string(),
  description: z.string(),
});

export type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

export const experienceFormDefaults: ExperienceFormValues = {
  company: '',
  title: '',
  period: '',
  description: '',
};

function optionalUrl(message: string) {
  return z
    .string()
    .trim()
    .refine((value) => value === '' || z.url().safeParse(value).success, message);
}

function optionalEmail() {
  return z
    .string()
    .trim()
    .refine(
      (value) => value === '' || z.email().safeParse(value).success,
      'Enter a valid email',
    );
}

export const projectFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  url: optionalUrl('Enter a valid URL'),
  description: z.string(),
  tech: z.string(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export const projectFormDefaults: ProjectFormValues = {
  title: '',
  url: '',
  description: '',
  tech: '',
};

export function parseTech(raw: string): string[] {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function projectFormValuesToPayload(values: ProjectFormValues) {
  return {
    title: values.title.trim(),
    description: values.description,
    url: values.url.trim() || undefined,
    tech: parseTech(values.tech),
  };
}

export const CONTACT_FORM_FIELDS = [
  'email',
  'phone',
  'github',
  'linkedin',
  'website',
  'location',
] as const;

export type ContactFormField = (typeof CONTACT_FORM_FIELDS)[number];

export const contactFormSchema = z.object({
  label: z.string(),
  email: optionalEmail(),
  phone: z.string(),
  github: z.string(),
  linkedin: z.string(),
  website: optionalUrl('Enter a valid URL'),
  location: z.string(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const contactFormDefaults: ContactFormValues = {
  label: 'Primary',
  email: '',
  phone: '',
  github: '',
  linkedin: '',
  website: '',
  location: '',
};

export function contactFormValuesToPayload(values: ContactFormValues) {
  return {
    label: values.label.trim() || 'Primary',
    ...Object.fromEntries(
      CONTACT_FORM_FIELDS.map((key) => [
        key,
        values[key].trim() || undefined,
      ]),
    ),
  };
}

export const skillFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().max(2000, 'Description is too long'),
  icon: z.string().trim().min(1, 'Choose or upload an icon'),
});

export type SkillFormValues = z.infer<typeof skillFormSchema>;

export const skillFormDefaults: SkillFormValues = {
  title: '',
  description: '',
  icon: '',
};

import {
  SUPPORTED_LOCALES,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from '@portfolio/shared';
import { z } from 'zod';

const localeEnum = z.enum([...SUPPORTED_LOCALES] as [
  (typeof SUPPORTED_LOCALES)[number],
  ...(typeof SUPPORTED_LOCALES)[number][],
]);

export const loginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
  username: z
    .string()
    .transform((value) => value.toLowerCase())
    .pipe(
      z
        .string()
        .min(USERNAME_MIN_LENGTH)
        .max(USERNAME_MAX_LENGTH)
        .regex(USERNAME_REGEX, 'Lowercase letters, numbers, hyphens only'),
    ),
  preferredLocale: localeEnum,
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

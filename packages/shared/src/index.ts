/** Roles for CMS and API authorization */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  BOTH = 'both',
}

/**
 * Locales used in public URLs: domain.com/{locale}/{username}
 * Keep in sync with Next.js i18n routing (M5).
 */
export const SUPPORTED_LOCALES = ['en', 'vi'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = 'en';

export function isSupportedLocale(value: string): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/** URL-safe username; reserved slugs blocked at API layer */
export const USERNAME_REGEX = /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])?$/;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;

export const RESERVED_USERNAMES = new Set([
  'admin',
  'api',
  'login',
  'register',
  'auth',
  'www',
  'app',
  'cms',
  'static',
  'en',
  'vi',
]);

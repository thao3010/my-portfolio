import type { AuthTokens } from '../api/types';

const TOKENS_KEY = 'portfolio.cms.tokens';

export function loadTokens(): AuthTokens | null {
  const raw = localStorage.getItem(TOKENS_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AuthTokens;
  } catch {
    localStorage.removeItem(TOKENS_KEY);
    return null;
  }
}

export function saveTokens(tokens: AuthTokens): void {
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
}

export function clearTokens(): void {
  localStorage.removeItem(TOKENS_KEY);
}

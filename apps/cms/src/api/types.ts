import type { PortfolioEditorPayload, SupportedLocale } from '@portfolio/shared';

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  role: string;
  preferredLocale: SupportedLocale;
  authProvider: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PortfolioPayload = PortfolioEditorPayload & {
  updatedAt?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = AuthTokens & {
  user: AuthUser;
};

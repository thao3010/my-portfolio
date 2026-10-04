import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { SupportedLocale } from '@portfolio/shared';
import * as api from '../api/client';
import { SESSION_EXPIRED_EVENT } from '../api/client';
import type { AuthUser } from '../api/types';
import { clearTokens, loadTokens, saveTokens } from './storage';

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    email: string;
    password: string;
    username: string;
    preferredLocale?: SupportedLocale;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokens = loadTokens();
    if (!tokens) {
      setLoading(false);
      return;
    }

    void api
      .fetchMe(tokens.accessToken)
      .then(setUser)
      .catch(() => clearTokens())
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onSessionExpired = () => setUser(null);
    window.addEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
    return () =>
      window.removeEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await api.login(email, password);
    saveTokens({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
    setUser(result.user);
  }, []);

  const register = useCallback(
    async (input: {
      email: string;
      password: string;
      username: string;
      preferredLocale?: SupportedLocale;
    }) => {
      const result = await api.register(input);
      saveTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
      setUser(result.user);
    },
    [],
  );

  const logout = useCallback(async () => {
    const tokens = loadTokens();
    if (tokens) {
      try {
        await api.logout(tokens.accessToken);
      } catch {
        // still clear local session
      }
    }
    clearTokens();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

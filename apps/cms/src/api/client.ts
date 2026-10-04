import type {
  ContactItem,
  ExperienceItem,
  PortfolioEditorPayload,
  ProjectItem,
  SkillIconPreset,
  SkillItem,
  SupportedLocale,
} from '@portfolio/shared';
import { clearTokens, loadTokens, saveTokens } from '../auth/storage';
import type { AuthResponse, AuthTokens, AuthUser, PortfolioPayload } from './types';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export const SESSION_EXPIRED_EVENT = 'portfolio:session-expired';

let refreshInFlight: Promise<AuthTokens> | null = null;

function notifySessionExpired(): void {
  clearTokens();
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}

async function tryRefreshTokens(): Promise<AuthTokens> {
  const stored = loadTokens();
  if (!stored?.refreshToken) {
    throw new Error('Session expired');
  }

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const response = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: stored.refreshToken }),
      });
      if (!response.ok) {
        throw new Error(await parseError(response));
      }
      const tokens = (await response.json()) as AuthTokens;
      saveTokens(tokens);
      return tokens;
    })().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
}

type RequestOptions = RequestInit & {
  token?: string;
  /** Skip 401 → refresh retry (e.g. refresh endpoint itself). */
  skipAuthRefresh?: boolean;
};

type ApiErrorBody = {
  message?: string | string[];
  error?: string;
};

async function parseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ApiErrorBody;
    if (Array.isArray(body.message)) {
      return body.message.join(', ');
    }
    if (body.message) {
      return String(body.message);
    }
    if (body.error) {
      return body.error;
    }
  } catch {
    // ignore
  }
  return `Request failed (${response.status})`;
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
  retried = false,
): Promise<T> {
  const { token, skipAuthRefresh, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    if (
      response.status === 401 &&
      token &&
      !retried &&
      !skipAuthRefresh
    ) {
      try {
        const newTokens = await tryRefreshTokens();
        return request<T>(
          path,
          { ...options, token: newTokens.accessToken },
          true,
        );
      } catch {
        notifySessionExpired();
      }
    }
    throw new Error(await parseError(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(input: {
  email: string;
  password: string;
  username: string;
  preferredLocale?: SupportedLocale;
}): Promise<AuthResponse> {
  return request<AuthResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function refreshAuthTokens(
  refreshToken: string,
): Promise<AuthTokens> {
  return request<AuthTokens>('/api/v1/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
    skipAuthRefresh: true,
  });
}

export async function fetchMe(accessToken: string): Promise<AuthUser> {
  return request<AuthUser>('/api/v1/auth/me', { token: accessToken });
}

export async function logout(accessToken: string): Promise<void> {
  await request('/api/v1/auth/logout', {
    method: 'POST',
    token: accessToken,
  });
}

export async function fetchMyPortfolio(
  accessToken: string,
): Promise<PortfolioPayload> {
  return request<PortfolioPayload>('/api/v1/me/portfolio', {
    token: accessToken,
  });
}

export async function saveMyPortfolio(
  accessToken: string,
  payload: Partial<PortfolioEditorPayload>,
): Promise<PortfolioPayload> {
  return request<PortfolioPayload>('/api/v1/me/portfolio', {
    method: 'PUT',
    token: accessToken,
    body: JSON.stringify(payload),
  });
}

export async function fetchAdminUsers(accessToken: string): Promise<AuthUser[]> {
  return request<AuthUser[]>('/api/v1/admin/users', { token: accessToken });
}

export async function patchAdminUser(
  accessToken: string,
  userId: string,
  body: { role?: string; isActive?: boolean },
): Promise<AuthUser> {
  return request<AuthUser>(`/api/v1/admin/users/${userId}`, {
    method: 'PATCH',
    token: accessToken,
    body: JSON.stringify(body),
  });
}

export async function fetchMySkills(accessToken: string): Promise<SkillItem[]> {
  return request<SkillItem[]>('/api/v1/me/skills', { token: accessToken });
}

export async function fetchSkillIconPresets(
  accessToken: string,
): Promise<SkillIconPreset[]> {
  return request<SkillIconPreset[]>('/api/v1/me/skills/icon-presets', {
    token: accessToken,
  });
}

export async function createSkill(
  accessToken: string,
  body: { icon: string; title: string; description: string },
): Promise<SkillItem> {
  return request<SkillItem>('/api/v1/me/skills', {
    method: 'POST',
    token: accessToken,
    body: JSON.stringify(body),
  });
}

export async function updateSkill(
  accessToken: string,
  skillId: string,
  body: Partial<{ icon: string; title: string; description: string }>,
): Promise<SkillItem> {
  return request<SkillItem>(`/api/v1/me/skills/${skillId}`, {
    method: 'PUT',
    token: accessToken,
    body: JSON.stringify(body),
  });
}

export async function deleteSkill(
  accessToken: string,
  skillId: string,
): Promise<void> {
  await request(`/api/v1/me/skills/${skillId}`, {
    method: 'DELETE',
    token: accessToken,
  });
}

async function fetchWithAuth(
  path: string,
  init: RequestInit,
  accessToken: string,
  retried = false,
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${accessToken}`);

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 401 && !retried) {
    try {
      const newTokens = await tryRefreshTokens();
      return fetchWithAuth(path, init, newTokens.accessToken, true);
    } catch {
      notifySessionExpired();
    }
  }

  return response;
}

export async function fetchMyExperiences(
  accessToken: string,
): Promise<ExperienceItem[]> {
  return request<ExperienceItem[]>('/api/v1/me/content/experiences', {
    token: accessToken,
  });
}

export async function createExperience(
  accessToken: string,
  body: {
    company: string;
    title: string;
    period?: string;
    description?: string;
  },
): Promise<ExperienceItem> {
  return request<ExperienceItem>('/api/v1/me/content/experiences', {
    method: 'POST',
    token: accessToken,
    body: JSON.stringify(body),
  });
}

export async function updateExperience(
  accessToken: string,
  id: string,
  body: Partial<{
    company: string;
    title: string;
    period: string;
    description: string;
  }>,
): Promise<ExperienceItem> {
  return request<ExperienceItem>(`/api/v1/me/content/experiences/${id}`, {
    method: 'PUT',
    token: accessToken,
    body: JSON.stringify(body),
  });
}

export async function deleteExperience(
  accessToken: string,
  id: string,
): Promise<void> {
  await request(`/api/v1/me/content/experiences/${id}`, {
    method: 'DELETE',
    token: accessToken,
  });
}

export async function fetchMyProjects(
  accessToken: string,
): Promise<ProjectItem[]> {
  return request<ProjectItem[]>('/api/v1/me/content/projects', {
    token: accessToken,
  });
}

export async function createProject(
  accessToken: string,
  body: {
    title: string;
    description?: string;
    url?: string;
    tech?: string[];
  },
): Promise<ProjectItem> {
  return request<ProjectItem>('/api/v1/me/content/projects', {
    method: 'POST',
    token: accessToken,
    body: JSON.stringify(body),
  });
}

export async function updateProject(
  accessToken: string,
  id: string,
  body: Partial<{
    title: string;
    description: string;
    url: string;
    tech: string[];
  }>,
): Promise<ProjectItem> {
  return request<ProjectItem>(`/api/v1/me/content/projects/${id}`, {
    method: 'PUT',
    token: accessToken,
    body: JSON.stringify(body),
  });
}

export async function deleteProject(
  accessToken: string,
  id: string,
): Promise<void> {
  await request(`/api/v1/me/content/projects/${id}`, {
    method: 'DELETE',
    token: accessToken,
  });
}

export async function fetchMyContacts(
  accessToken: string,
): Promise<ContactItem[]> {
  return request<ContactItem[]>('/api/v1/me/content/contacts', {
    token: accessToken,
  });
}

export async function createContact(
  accessToken: string,
  body: Partial<{
    label: string;
    email: string;
    phone: string;
    github: string;
    linkedin: string;
    website: string;
    location: string;
  }>,
): Promise<ContactItem> {
  return request<ContactItem>('/api/v1/me/content/contacts', {
    method: 'POST',
    token: accessToken,
    body: JSON.stringify(body),
  });
}

export async function updateContact(
  accessToken: string,
  id: string,
  body: Partial<{
    label: string;
    email: string;
    phone: string;
    github: string;
    linkedin: string;
    website: string;
    location: string;
  }>,
): Promise<ContactItem> {
  return request<ContactItem>(`/api/v1/me/content/contacts/${id}`, {
    method: 'PUT',
    token: accessToken,
    body: JSON.stringify(body),
  });
}

export async function deleteContact(
  accessToken: string,
  id: string,
): Promise<void> {
  await request(`/api/v1/me/content/contacts/${id}`, {
    method: 'DELETE',
    token: accessToken,
  });
}

export async function uploadSkillIcon(
  accessToken: string,
  file: File,
): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetchWithAuth(
    '/api/v1/me/skills/icon-upload',
    { method: 'POST', body: formData },
    accessToken,
  );

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as { url: string };
}

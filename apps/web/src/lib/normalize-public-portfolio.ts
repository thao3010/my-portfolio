import {
  normalizeSectionOrder,
  type PortfolioSkill,
} from '@portfolio/shared';
import type { PublicPortfolioData } from '../components/public-portfolio-view';

function normalizeSkills(raw: unknown): PortfolioSkill[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const skills: PortfolioSkill[] = [];
  for (let i = 0; i < raw.length; i++) {
    const item = raw[i];
    if (typeof item === 'string') {
      skills.push({
        id: `legacy-skill-${i}`,
        icon: '',
        title: item,
        description: '',
      });
      continue;
    }
    if (!item || typeof item !== 'object') {
      continue;
    }
    const row = item as Record<string, unknown>;
    const title = String(row.title ?? '').trim();
    if (!title) {
      continue;
    }
    skills.push({
      id: String(row.id ?? `skill-${i}`),
      icon: String(row.icon ?? ''),
      title,
      description: String(row.description ?? ''),
    });
  }
  return skills;
}

export function normalizePublicPortfolio(
  raw: Record<string, unknown>,
  locale: string,
): PublicPortfolioData {
  const contact =
    raw.contact && typeof raw.contact === 'object'
      ? (raw.contact as PublicPortfolioData['contact'])
      : {};

  const username = String(raw.username ?? '');

  return {
    username,
    locale,
    displayName: String(raw.displayName ?? ''),
    headline: String(raw.headline ?? ''),
    summary: String(raw.summary ?? ''),
    contact,
    sectionOrder: normalizeSectionOrder(raw.sectionOrder),
    experiences: Array.isArray(raw.experiences) ? raw.experiences : [],
    projects: Array.isArray(raw.projects) ? raw.projects : [],
    skills: normalizeSkills(raw.skills),
    cvDownloadUrl: buildCvDownloadUrl(username),
  };
}

function buildCvDownloadUrl(username: string): string {
  if (!username) {
    return '';
  }
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3847';
  return `${apiBase}/api/v1/public/portfolios/${encodeURIComponent(username)}/cv/download`;
}

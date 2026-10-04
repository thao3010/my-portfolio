import type { PortfolioSectionId, SurfaceLayout } from './surface-layout';
import { createEmptySurfaceLayout } from './surface-layout';

export type PortfolioContact = {
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  location?: string;
};

export type PortfolioExperience = {
  id: string;
  company: string;
  title: string;
  period: string;
  description: string;
};

export type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  url?: string;
  tech: string[];
};

/** Resolved skill row for public portfolio / CV (from content library). */
export type PortfolioSkill = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export type PortfolioProfile = {
  displayName: string;
  headline: string;
  summary: string;
  isPublished: boolean;
};

/** CMS: profile + section pick/order for portfolio and CV surfaces. */
export type PortfolioEditorPayload = PortfolioProfile & {
  portfolioLayout: SurfaceLayout;
  cvLayout: SurfaceLayout;
};

export type PortfolioContent = PortfolioProfile & {
  sectionOrder: PortfolioSectionId[];
  contact: PortfolioContact;
  experiences: PortfolioExperience[];
  projects: PortfolioProject[];
  skills: PortfolioSkill[];
};

export function createEmptyPortfolioContent(): PortfolioContent {
  const layout = createEmptySurfaceLayout();
  return {
    displayName: '',
    headline: '',
    summary: '',
    sectionOrder: layout.sectionOrder,
    contact: {},
    experiences: [],
    projects: [],
    skills: [],
    isPublished: false,
  };
}

export function createEmptyPortfolioEditorPayload(): PortfolioEditorPayload {
  return {
    displayName: '',
    headline: '',
    summary: '',
    isPublished: false,
    portfolioLayout: createEmptySurfaceLayout(),
    cvLayout: createEmptySurfaceLayout(),
  };
}

export function createPortfolioItemId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

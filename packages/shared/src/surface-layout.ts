export const PORTFOLIO_SECTIONS = [
  'contact',
  'experience',
  'projects',
  'skills',
] as const;

export type PortfolioSectionId = (typeof PORTFOLIO_SECTIONS)[number];

export const DEFAULT_PORTFOLIO_SECTION_ORDER: PortfolioSectionId[] = [
  ...PORTFOLIO_SECTIONS,
];

export type SurfaceLayout = {
  sectionOrder: PortfolioSectionId[];
  experienceIds: string[];
  projectIds: string[];
  contactIds: string[];
  skillIds: string[];
};

export function createEmptySurfaceLayout(): SurfaceLayout {
  return {
    sectionOrder: [...DEFAULT_PORTFOLIO_SECTION_ORDER],
    experienceIds: [],
    projectIds: [],
    contactIds: [],
    skillIds: [],
  };
}

export function normalizeSectionOrder(raw: unknown): PortfolioSectionId[] {
  const fallback = [...DEFAULT_PORTFOLIO_SECTION_ORDER];
  if (!Array.isArray(raw)) {
    return fallback;
  }
  const valid = new Set<string>(PORTFOLIO_SECTIONS);
  const seen = new Set<PortfolioSectionId>();
  const order: PortfolioSectionId[] = [];
  for (const item of raw) {
    if (typeof item !== 'string' || !valid.has(item)) {
      continue;
    }
    const id = item as PortfolioSectionId;
    if (seen.has(id)) {
      continue;
    }
    seen.add(id);
    order.push(id);
  }
  for (const id of fallback) {
    if (!seen.has(id)) {
      order.push(id);
    }
  }
  return order;
}

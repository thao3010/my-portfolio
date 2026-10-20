export type PortfolioSectionTitles = {
  contact: string;
  experience: string;
  projects: string;
  skills: string;
};

export const PORTFOLIO_CONTACT_FIELDS = [
  'email',
  'phone',
  'github',
  'linkedin',
  'website',
  'location',
] as const;

export type PortfolioContactFieldKey =
  (typeof PORTFOLIO_CONTACT_FIELDS)[number];

export type PortfolioContactFieldLabels = Record<
  PortfolioContactFieldKey,
  string
>;

export const DEFAULT_PORTFOLIO_CONTACT_FIELD_LABELS: PortfolioContactFieldLabels =
  {
    email: 'Email',
    phone: 'Phone',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    website: 'Website',
    location: 'Location',
  };

/** Copy and labels shown on the public portfolio page (editable in CMS). */
export type PortfolioPublicUi = {
  badgeLabel: string;
  cvDownloadLabel: string;
  backLinkLabel: string;
  emptyDraftHint: string;
  sectionTitles: PortfolioSectionTitles;
  contactFieldLabels: PortfolioContactFieldLabels;
};

export const DEFAULT_PORTFOLIO_SECTION_TITLES: PortfolioSectionTitles = {
  contact: 'Contact',
  experience: 'Experience',
  projects: 'Selected work',
  skills: 'Skills',
};

export const DEFAULT_PORTFOLIO_PUBLIC_UI: PortfolioPublicUi = {
  badgeLabel: 'Frontend · React',
  cvDownloadLabel: 'Download CV (PDF)',
  backLinkLabel: '← Back to home',
  emptyDraftHint:
    'Portfolio is published but sections are empty — add content in the CMS editor.',
  sectionTitles: { ...DEFAULT_PORTFOLIO_SECTION_TITLES },
  contactFieldLabels: { ...DEFAULT_PORTFOLIO_CONTACT_FIELD_LABELS },
};

function trimString(value: unknown, fallback: string, maxLen: number): string {
  if (typeof value !== 'string') {
    return fallback;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }
  return trimmed.length > maxLen ? trimmed.slice(0, maxLen) : trimmed;
}

function normalizeContactFieldLabels(
  raw: unknown,
): PortfolioContactFieldLabels {
  const defaults = DEFAULT_PORTFOLIO_CONTACT_FIELD_LABELS;
  const o =
    raw && typeof raw === 'object'
      ? (raw as Record<string, unknown>)
      : {};
  const result = { ...defaults };
  for (const key of PORTFOLIO_CONTACT_FIELDS) {
    result[key] = trimString(o[key], defaults[key], 40);
  }
  return result;
}

export function normalizePortfolioPublicUi(raw: unknown): PortfolioPublicUi {
  const defaults = DEFAULT_PORTFOLIO_PUBLIC_UI;
  if (!raw || typeof raw !== 'object') {
    return {
      ...defaults,
      sectionTitles: { ...defaults.sectionTitles },
      contactFieldLabels: { ...defaults.contactFieldLabels },
    };
  }
  const o = raw as Record<string, unknown>;
  const titlesRaw =
    o.sectionTitles && typeof o.sectionTitles === 'object'
      ? (o.sectionTitles as Record<string, unknown>)
      : {};

  return {
    badgeLabel: trimString(o.badgeLabel, defaults.badgeLabel, 120),
    cvDownloadLabel: trimString(
      o.cvDownloadLabel,
      defaults.cvDownloadLabel,
      120,
    ),
    backLinkLabel: trimString(o.backLinkLabel, defaults.backLinkLabel, 120),
    emptyDraftHint: trimString(o.emptyDraftHint, defaults.emptyDraftHint, 500),
    sectionTitles: {
      contact: trimString(
        titlesRaw.contact,
        defaults.sectionTitles.contact,
        80,
      ),
      experience: trimString(
        titlesRaw.experience,
        defaults.sectionTitles.experience,
        80,
      ),
      projects: trimString(
        titlesRaw.projects,
        defaults.sectionTitles.projects,
        80,
      ),
      skills: trimString(titlesRaw.skills, defaults.sectionTitles.skills, 80),
    },
    contactFieldLabels: normalizeContactFieldLabels(o.contactFieldLabels),
  };
}

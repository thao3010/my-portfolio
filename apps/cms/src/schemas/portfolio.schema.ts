import { z } from 'zod';

const sectionTitlesSchema = z.object({
  contact: z.string().max(80),
  experience: z.string().max(80),
  projects: z.string().max(80),
  skills: z.string().max(80),
});

const contactFieldLabelsSchema = z.object({
  email: z.string().max(40),
  phone: z.string().max(40),
  github: z.string().max(40),
  linkedin: z.string().max(40),
  website: z.string().max(40),
  location: z.string().max(40),
});

const publicUiSchema = z.object({
  badgeLabel: z.string().max(120),
  cvDownloadLabel: z.string().max(120),
  backLinkLabel: z.string().max(120),
  emptyDraftHint: z.string().max(500),
  sectionTitles: sectionTitlesSchema,
  contactFieldLabels: contactFieldLabelsSchema,
});

export const portfolioFormSchema = z.object({
  displayName: z.string().max(120),
  headline: z.string().max(200),
  summary: z.string().max(5000),
  isPublished: z.boolean(),
  publicUi: publicUiSchema,
});

export type PortfolioFormValues = z.infer<typeof portfolioFormSchema>;

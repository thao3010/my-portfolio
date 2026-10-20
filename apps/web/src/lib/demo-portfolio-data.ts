import {
  DEFAULT_PORTFOLIO_PUBLIC_UI,
  type PortfolioPublicUi,
} from '@portfolio/shared';
import type { PublicPortfolioData } from '../components/public-portfolio-view';

const DEMO_PUBLIC_UI: PortfolioPublicUi = {
  ...DEFAULT_PORTFOLIO_PUBLIC_UI,
  badgeLabel: 'Demo · React · Motion',
  cvDownloadLabel: 'Download sample CV',
  backLinkLabel: '← Back to platform home',
  emptyDraftHint: '',
  sectionTitles: {
    contact: 'Get in touch',
    experience: 'Career highlights',
    projects: 'Featured work',
    skills: 'Toolbox',
  },
};

/** Static showcase portfolio for /demo-user (no API). */
export const DEMO_PORTFOLIO_DATA: PublicPortfolioData = {
  username: 'demo-user',
  displayName: 'Alex Rivera',
  headline:
    'Product engineer shipping polished interfaces with React, Next.js, and motion design.',
  summary: `
    <p>I design and build portfolio platforms that feel alive in the browser — from CMS authoring to public pages at <code>/{username}</code>.</p>
    <p>This route is a <strong>live demo</strong> of the public portfolio layout: timeline, 3D project carousel, and skill cards with the same motion system as production.</p>
  `.trim(),
  publicUi: DEMO_PUBLIC_UI,
  cvDownloadUrl: '',
  sectionOrder: ['experience', 'projects', 'skills', 'contact'],
  contact: {
    email: 'alex.rivera@example.com',
    phone: '+1 (415) 555-0142',
    location: 'San Francisco, CA',
    website: 'https://example.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  experiences: [
    {
      id: 'exp-1',
      title: 'Staff Frontend Engineer',
      company: 'Northwind Labs',
      period: '2022 — Present',
      description: `
        <p>Led the public portfolio surface: section ordering from CMS, SSR-friendly data normalization, and a motion layer shared across hero, carousel, and skill grids.</p>
        <ul>
          <li>Cut time-to-publish for creators from days to minutes with layout presets.</li>
          <li>Shipped accessible 3D carousel with keyboard focus and reduced-motion fallbacks.</li>
        </ul>
      `.trim(),
    },
    {
      id: 'exp-2',
      title: 'Senior UI Engineer',
      company: 'Atlas Commerce',
      period: '2019 — 2022',
      description: `
        <p>Owned checkout and account experiences for a multi-region storefront (Next.js, design tokens, Storybook).</p>
        <p>Mentored three engineers on performance budgets and animation choreography.</p>
      `.trim(),
    },
    {
      id: 'exp-3',
      title: 'Frontend Developer',
      company: 'Studio Kite',
      period: '2016 — 2019',
      description: `
        <p>Built marketing sites and interactive case studies for agency clients — WebGL-lite heroes, scroll storytelling, and CMS-driven case study templates.</p>
      `.trim(),
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Portfolio Builder Platform',
      period: '2024 — 2026',
      description:
        'Self-hosted CMS + public Next.js site with role-based editing and username routes.',
      content: `
        <p>End-to-end platform: NestJS API, React CMS, and motion-rich public pages. Creators manage a content library, drag sections on a display layout, and publish to <code>/username</code>.</p>
        <p><strong>Impact:</strong> unified authoring, predictable public URLs, and a demo route for prospects.</p>
      `.trim(),
      url: 'https://example.com/portfolio-builder',
      tech: ['Next.js', 'NestJS', 'PostgreSQL', 'Motion'],
    },
    {
      id: 'proj-2',
      title: 'Orbit Analytics',
      period: '2023',
      description:
        'Real-time dashboard for product teams with collaborative filters and export.',
      content: `
        <p>Designed a dense but calm analytics UI: virtualized tables, sparkline headers, and shareable filter URLs.</p>
        <p>Reduced median query-to-insight time with optimistic filter chips and skeleton states tuned to 60fps.</p>
      `.trim(),
      url: 'https://example.com/orbit',
      tech: ['React', 'TypeScript', 'D3', 'WebSockets'],
    },
    {
      id: 'proj-3',
      title: 'Lumen Design System',
      period: '2022',
      description:
        'Token-driven component library with dark mode and documentation site.',
      content: `
        <p>Shipped 40+ primitives with consistent motion curves and focus rings. Documented patterns for forms, empty states, and data tables.</p>
      `.trim(),
      tech: ['Storybook', 'Tailwind', 'Figma', 'A11y'],
    },
    {
      id: 'proj-4',
      title: 'Harbor Checkout',
      period: '2021',
      description:
        'Internationalized checkout rebuilt for Core Web Vitals and conversion.',
      content: `
        <p>Split payment and address steps, lazy-loaded heavy widgets, and improved LCP by 38% on mobile 4G profiles.</p>
      `.trim(),
      url: 'https://example.com/harbor',
      tech: ['Next.js', 'Stripe', 'i18n', 'Edge'],
    },
    {
      id: 'proj-5',
      title: 'Signal Docs',
      period: '2020',
      description:
        'Developer documentation with live code playgrounds and version switcher.',
      content: `
        <p>MDX pipeline, full-text search, and interactive snippets that sync theme with the marketing site.</p>
      `.trim(),
      tech: ['MDX', 'Algolia', 'React', 'Vercel'],
    },
  ],
  skills: [
    {
      id: 'skill-react',
      icon: 'https://cdn.simpleicons.org/react/61DAFB',
      title: 'React',
      description: 'Server & client components, hooks, and performance profiling.',
    },
    {
      id: 'skill-ts',
      icon: 'https://cdn.simpleicons.org/typescript/3178C6',
      title: 'TypeScript',
      description: 'Shared types across API, CMS, and public app packages.',
    },
    {
      id: 'skill-next',
      icon: 'https://cdn.simpleicons.org/nextdotjs/000000',
      title: 'Next.js',
      description: 'App Router, dynamic routes, and SSR data fetching.',
    },
    {
      id: 'skill-nest',
      icon: 'https://cdn.simpleicons.org/nestjs/E0234E',
      title: 'NestJS',
      description: 'Modular APIs, validation, and public portfolio endpoints.',
    },
    {
      id: 'skill-pg',
      icon: 'https://cdn.simpleicons.org/postgresql/4169E1',
      title: 'PostgreSQL',
      description: 'Migrations, relational content models, and safe public reads.',
    },
    {
      id: 'skill-docker',
      icon: 'https://cdn.simpleicons.org/docker/2496ED',
      title: 'Docker',
      description: 'Local stacks and reproducible deploy artifacts.',
    },
    {
      id: 'skill-figma',
      icon: 'https://cdn.simpleicons.org/figma/F24E1E',
      title: 'Figma',
      description: 'Design-to-code handoff and motion specs.',
    },
    {
      id: 'skill-git',
      icon: 'https://cdn.simpleicons.org/git/F05032',
      title: 'Git',
      description: 'Trunk-based flow, reviews, and CI-friendly commits.',
    },
  ],
};

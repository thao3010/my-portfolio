export type SkillIconPreset = {
  id: string;
  label: string;
  iconUrl: string;
};

/** Resolved by API to /api/v1/builtin-skill-icons/{file} */
export const BUILTIN_SKILL_ICON_PREFIX = 'builtin-skill-icon:';

export function resolveSkillIconPresetUrl(
  iconUrl: string,
  publicBaseUrl: string,
): string {
  if (!iconUrl.startsWith(BUILTIN_SKILL_ICON_PREFIX)) {
    return iconUrl;
  }
  const file = iconUrl.slice(BUILTIN_SKILL_ICON_PREFIX.length);
  const base = publicBaseUrl.replace(/\/$/, '');
  return `${base}/api/v1/builtin-skill-icons/${file}`;
}

/** Fix stored icons that pointed at removed/broken AWS CDN URLs */
export function normalizeSkillIconUrl(
  iconUrl: string,
  publicBaseUrl: string,
): string {
  const trimmed = iconUrl.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (trimmed.startsWith(BUILTIN_SKILL_ICON_PREFIX)) {
    return resolveSkillIconPresetUrl(trimmed, publicBaseUrl);
  }
  const lower = trimmed.toLowerCase();
  if (
    lower.includes('amazonaws') ||
    lower.includes('amazonwebservices')
  ) {
    return resolveSkillIconPresetUrl(
      `${BUILTIN_SKILL_ICON_PREFIX}aws.svg`,
      publicBaseUrl,
    );
  }
  return trimmed;
}

/** Curated icons users can pick without uploading */
export const SKILL_ICON_PRESETS: SkillIconPreset[] = [
  // Core technologies
  {
    id: 'javascript',
    label: 'JavaScript (ES6+)',
    iconUrl: 'https://cdn.simpleicons.org/javascript/F7DF1E',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    iconUrl: 'https://cdn.simpleicons.org/typescript/3178C6',
  },
  {
    id: 'html5',
    label: 'HTML5',
    iconUrl: 'https://cdn.simpleicons.org/html5/E34F26',
  },
  {
    id: 'css3-scss',
    label: 'CSS3 / SCSS',
    iconUrl: 'https://cdn.simpleicons.org/sass/CC6699',
  },
  {
    id: 'react',
    label: 'React.js',
    iconUrl: 'https://cdn.simpleicons.org/react/61DAFB',
  },
  {
    id: 'nextjs',
    label: 'Next.js (App Router)',
    iconUrl: 'https://cdn.simpleicons.org/nextdotjs/000000',
  },
  {
    id: 'angular',
    label: 'Angular',
    iconUrl: 'https://cdn.simpleicons.org/angular/DD0031',
  },

  // State & data management
  {
    id: 'tanstack-query',
    label: 'TanStack Query',
    iconUrl: 'https://cdn.simpleicons.org/reactquery/FF4154',
  },
  {
    id: 'zustand',
    label: 'Zustand',
    iconUrl:
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/zustand/zustand-original.svg',
  },
  {
    id: 'redux-toolkit',
    label: 'Redux Toolkit',
    iconUrl: 'https://cdn.simpleicons.org/redux/764ABC',
  },
  {
    id: 'rxjs',
    label: 'RxJS',
    iconUrl: 'https://cdn.simpleicons.org/reactivex/B7178C',
  },
  {
    id: 'rest-api',
    label: 'RESTful API',
    iconUrl: 'https://cdn.simpleicons.org/swagger/85EA2D',
  },
  {
    id: 'socketio',
    label: 'Socket.IO',
    iconUrl: 'https://cdn.simpleicons.org/socketdotio/010101',
  },

  // UI, styling & architecture
  {
    id: 'tailwindcss',
    label: 'Tailwind CSS',
    iconUrl: 'https://cdn.simpleicons.org/tailwindcss/06B6D4',
  },
  {
    id: 'mui',
    label: 'Material-UI (MUI)',
    iconUrl: 'https://cdn.simpleicons.org/mui/007FFF',
  },
  {
    id: 'shadcn-ui',
    label: 'shadcn/ui',
    iconUrl: 'https://cdn.simpleicons.org/radixui/161618',
  },
  {
    id: 'ant-design',
    label: 'Ant Design',
    iconUrl: 'https://cdn.simpleicons.org/antdesign/0170FE',
  },
  {
    id: 'responsive-design',
    label: 'Responsive Design',
    iconUrl: 'https://cdn.simpleicons.org/materialdesign/757575',
  },
  {
    id: 'component-architecture',
    label: 'Component Architecture',
    iconUrl: 'https://cdn.simpleicons.org/storybook/FF4785',
  },

  // Engineering practices
  {
    id: 'performance',
    label: 'Performance Optimization',
    iconUrl: 'https://cdn.simpleicons.org/lighthouse/F44B21',
  },
  {
    id: 'web-seo',
    label: 'Web SEO',
    iconUrl: 'https://cdn.simpleicons.org/googlesearchconsole/458CF5',
  },
  {
    id: 'vitest',
    label: 'Vitest',
    iconUrl: 'https://cdn.simpleicons.org/vitest/6E9F18',
  },
  {
    id: 'git',
    label: 'Git',
    iconUrl: 'https://cdn.simpleicons.org/git/F05032',
  },
  {
    id: 'code-splitting',
    label: 'Code Splitting',
    iconUrl: 'https://cdn.simpleicons.org/webpack/8DD6F9',
  },
  {
    id: 'cursor',
    label: 'Cursor',
    iconUrl: 'https://cdn.simpleicons.org/cursor/000000',
  },
  {
    id: 'github-copilot',
    label: 'GitHub Copilot',
    iconUrl: 'https://cdn.simpleicons.org/githubcopilot/000000',
  },

  // QA & testing
  {
    id: 'test-cases',
    label: 'Test Cases',
    iconUrl: 'https://cdn.simpleicons.org/jest/C21325',
  },
  {
    id: 'functional-testing',
    label: 'Functional Testing',
    iconUrl: 'https://cdn.simpleicons.org/testinglibrary/E33332',
  },
  {
    id: 'regression-testing',
    label: 'Regression Testing',
    iconUrl: 'https://cdn.simpleicons.org/cypress/69D3A7',
  },
  {
    id: 'smoke-testing',
    label: 'Smoke Testing',
    iconUrl: 'https://cdn.simpleicons.org/mocha/8D6748',
  },
  {
    id: 'exploratory-testing',
    label: 'Exploratory Testing',
    iconUrl:
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/playwright/playwright-original.svg',
  },
  {
    id: 'cross-platform-testing',
    label: 'Cross-platform Testing',
    iconUrl: 'https://cdn.simpleicons.org/appium/EE376D',
  },
  {
    id: 'bug-retesting',
    label: 'Bug Retesting',
    iconUrl: 'https://cdn.simpleicons.org/jira/0052CC',
  },

  // Tools
  {
    id: 'jira',
    label: 'Jira',
    iconUrl: 'https://cdn.simpleicons.org/jira/0052CC',
  },
  {
    id: 'postman',
    label: 'Postman',
    iconUrl: 'https://cdn.simpleicons.org/postman/FF6C37',
  },
  {
    id: 'sql',
    label: 'SQL',
    iconUrl: 'https://cdn.simpleicons.org/mysql/4479A1',
  },

  // Platforms & domains
  {
    id: 'web',
    label: 'Web',
    iconUrl: 'https://cdn.simpleicons.org/googlechrome/4285F4',
  },
  {
    id: 'mobile',
    label: 'Mobile',
    iconUrl: 'https://cdn.simpleicons.org/android/3DDC84',
  },
  {
    id: 'cms',
    label: 'CMS',
    iconUrl: 'https://cdn.simpleicons.org/strapi/4945FF',
  },

  // Process
  {
    id: 'agile-scrum',
    label: 'Agile / Scrum',
    iconUrl: 'https://cdn.simpleicons.org/confluence/172B4D',
  },
  {
    id: 'sdlc',
    label: 'SDLC',
    iconUrl: 'https://cdn.simpleicons.org/gitlab/FC6D26',
  },
  {
    id: 'stlc',
    label: 'STLC',
    iconUrl: 'https://cdn.simpleicons.org/selenium/43B02A',
  },

  // Additional stack (legacy presets)
  {
    id: 'nodejs',
    label: 'Node.js',
    iconUrl: 'https://cdn.simpleicons.org/nodedotjs/339933',
  },
  {
    id: 'nestjs',
    label: 'NestJS',
    iconUrl: 'https://cdn.simpleicons.org/nestjs/E0234E',
  },
  {
    id: 'postgresql',
    label: 'PostgreSQL',
    iconUrl: 'https://cdn.simpleicons.org/postgresql/4169E1',
  },
  {
    id: 'docker',
    label: 'Docker',
    iconUrl: 'https://cdn.simpleicons.org/docker/2496ED',
  },
  {
    id: 'figma',
    label: 'Figma',
    iconUrl: 'https://cdn.simpleicons.org/figma/F24E1E',
  },
  {
    id: 'python',
    label: 'Python',
    iconUrl: 'https://cdn.simpleicons.org/python/3776AB',
  },
  {
    id: 'aws',
    label: 'AWS',
    iconUrl: `${BUILTIN_SKILL_ICON_PREFIX}aws.svg`,
  },
  {
    id: 'graphql',
    label: 'GraphQL',
    iconUrl: 'https://cdn.simpleicons.org/graphql/E10098',
  },
];

export type SkillItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

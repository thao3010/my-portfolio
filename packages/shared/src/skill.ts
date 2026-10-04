export type SkillIconPreset = {
  id: string;
  label: string;
  iconUrl: string;
};

/** Curated icons users can pick without uploading */
export const SKILL_ICON_PRESETS: SkillIconPreset[] = [
  {
    id: 'react',
    label: 'React',
    iconUrl: 'https://cdn.simpleicons.org/react/61DAFB',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    iconUrl: 'https://cdn.simpleicons.org/typescript/3178C6',
  },
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
    id: 'nextjs',
    label: 'Next.js',
    iconUrl: 'https://cdn.simpleicons.org/nextdotjs/000000',
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
    id: 'git',
    label: 'Git',
    iconUrl: 'https://cdn.simpleicons.org/git/F05032',
  },
  {
    id: 'aws',
    label: 'AWS',
    iconUrl: 'https://cdn.simpleicons.org/amazonaws/FF9900',
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

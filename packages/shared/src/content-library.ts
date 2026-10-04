export type ExperienceItem = {
  id: string;
  company: string;
  title: string;
  period: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectItem = {
  id: string;
  title: string;
  description: string;
  url?: string;
  tech: string[];
  createdAt: string;
  updatedAt: string;
};

export type ContactItem = {
  id: string;
  label: string;
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
};

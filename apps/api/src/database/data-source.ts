import './load-env';
import { DataSource } from 'typeorm';
import { ContactProfile } from '../content-library/entities/contact-profile.entity';
import { Experience } from '../content-library/entities/experience.entity';
import { Project } from '../content-library/entities/project.entity';
import { Portfolio } from '../portfolios/entities/portfolio.entity';
import { Skill } from '../skills/entities/skill.entity';
import { User } from '../users/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5433', 10),
  username: process.env.DATABASE_USER ?? 'portfolio',
  password: process.env.DATABASE_PASSWORD ?? 'portfolio',
  database: process.env.DATABASE_NAME ?? 'portfolio',
  entities: [User, Portfolio, Skill, Experience, Project, ContactProfile],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
});

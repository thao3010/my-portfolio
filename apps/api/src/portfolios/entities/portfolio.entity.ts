import type {
  PortfolioContact,
  PortfolioExperience,
  PortfolioProject,
  SurfaceLayout,
} from '@portfolio/shared';
import { createEmptySurfaceLayout } from '@portfolio/shared';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('portfolios')
export class Portfolio {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', unique: true })
  userId!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'display_name', default: '' })
  displayName!: string;

  @Column({ default: '' })
  headline!: string;

  @Column({ type: 'text', default: '' })
  summary!: string;

  @Column({ type: 'jsonb', default: {} })
  contact!: PortfolioContact;

  @Column({ type: 'jsonb', default: [] })
  experiences!: PortfolioExperience[];

  @Column({ type: 'jsonb', default: [] })
  projects!: PortfolioProject[];

  @Column({ type: 'jsonb', default: [] })
  skills!: string[];

  @Column({ name: 'is_published', default: false })
  isPublished!: boolean;

  @Column({
    name: 'portfolio_layout',
    type: 'jsonb',
    default: createEmptySurfaceLayout(),
  })
  portfolioLayout!: SurfaceLayout;

  @Column({
    name: 'cv_layout',
    type: 'jsonb',
    default: createEmptySurfaceLayout(),
  })
  cvLayout!: SurfaceLayout;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

import { AuthProvider, DEFAULT_LOCALE, UserRole } from '@portfolio/shared';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', nullable: true })
  passwordHash!: string | null;

  @Column({ unique: true })
  username!: string;

  @Column({ type: 'varchar', default: UserRole.USER })
  role!: UserRole;

  @Column({
    name: 'auth_provider',
    type: 'varchar',
    default: AuthProvider.LOCAL,
  })
  authProvider!: AuthProvider;

  @Column({ name: 'google_id', type: 'varchar', nullable: true, unique: true })
  googleId!: string | null;

  @Column({
    name: 'preferred_locale',
    type: 'varchar',
    default: DEFAULT_LOCALE,
  })
  preferredLocale!: string;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @Column({ name: 'refresh_token_hash', type: 'varchar', nullable: true })
  refreshTokenHash!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

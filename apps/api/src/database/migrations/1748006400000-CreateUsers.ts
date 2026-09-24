import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1748006400000 implements MigrationInterface {
  name = 'CreateUsers1748006400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password_hash" character varying,
        "username" character varying NOT NULL,
        "role" character varying NOT NULL DEFAULT 'user',
        "auth_provider" character varying NOT NULL DEFAULT 'local',
        "google_id" character varying,
        "preferred_locale" character varying NOT NULL DEFAULT 'en',
        "is_active" boolean NOT NULL DEFAULT true,
        "refresh_token_hash" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "UQ_users_username" UNIQUE ("username"),
        CONSTRAINT "UQ_users_google_id" UNIQUE ("google_id"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}

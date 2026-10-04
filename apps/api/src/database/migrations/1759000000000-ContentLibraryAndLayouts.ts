import { MigrationInterface, QueryRunner } from 'typeorm';

export class ContentLibraryAndLayouts1759000000000 implements MigrationInterface {
  name = 'ContentLibraryAndLayouts1759000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "experiences" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "company" character varying NOT NULL,
        "title" character varying NOT NULL,
        "period" character varying NOT NULL DEFAULT '',
        "description" text NOT NULL DEFAULT '',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_experiences_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_experiences_user_id" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_experiences_user_id" ON "experiences" ("user_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "title" character varying NOT NULL,
        "description" text NOT NULL DEFAULT '',
        "url" character varying,
        "tech" jsonb NOT NULL DEFAULT '[]',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_projects_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_projects_user_id" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_projects_user_id" ON "projects" ("user_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "contact_profiles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "label" character varying NOT NULL DEFAULT 'Primary',
        "email" character varying,
        "phone" character varying,
        "github" character varying,
        "linkedin" character varying,
        "website" character varying,
        "location" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_contact_profiles_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_contact_profiles_user_id" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_contact_profiles_user_id" ON "contact_profiles" ("user_id")`,
    );

    await queryRunner.query(`
      ALTER TABLE "portfolios"
      ADD COLUMN "portfolio_layout" jsonb NOT NULL DEFAULT '{"experienceIds":[],"projectIds":[],"contactIds":[],"skillIds":[]}',
      ADD COLUMN "cv_layout" jsonb NOT NULL DEFAULT '{"experienceIds":[],"projectIds":[],"contactIds":[],"skillIds":[]}'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "portfolios"
      DROP COLUMN "cv_layout",
      DROP COLUMN "portfolio_layout"
    `);
    await queryRunner.query(`DROP TABLE "contact_profiles"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TABLE "experiences"`);
  }
}

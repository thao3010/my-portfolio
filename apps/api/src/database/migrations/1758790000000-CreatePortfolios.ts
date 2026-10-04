import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePortfolios1758790000000 implements MigrationInterface {
  name = 'CreatePortfolios1758790000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "portfolios" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "display_name" character varying NOT NULL DEFAULT '',
        "headline" character varying NOT NULL DEFAULT '',
        "summary" text NOT NULL DEFAULT '',
        "contact" jsonb NOT NULL DEFAULT '{}',
        "experiences" jsonb NOT NULL DEFAULT '[]',
        "projects" jsonb NOT NULL DEFAULT '[]',
        "skills" jsonb NOT NULL DEFAULT '[]',
        "is_published" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_portfolios_user_id" UNIQUE ("user_id"),
        CONSTRAINT "PK_portfolios_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_portfolios_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "portfolios"`);
  }
}

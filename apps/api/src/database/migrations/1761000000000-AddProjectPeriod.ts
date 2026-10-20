import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectPeriod1761000000000 implements MigrationInterface {
  name = 'AddProjectPeriod1761000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "projects"
      ADD COLUMN "period" character varying NOT NULL DEFAULT ''
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "period"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class PortfolioPublicUi1760800000000 implements MigrationInterface {
  name = 'PortfolioPublicUi1760800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "portfolios" ADD COLUMN "public_ui" jsonb NOT NULL DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "portfolios" DROP COLUMN "public_ui"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class StripLifecycleFromPublicUi1760900000000 implements MigrationInterface {
  name = 'StripLifecycleFromPublicUi1760900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "portfolios"
      SET "public_ui" = "public_ui"
        - 'showLifecyclePanel'
        - 'lifecyclePanel'
        - 'simpleDiagram'
      WHERE "public_ui" ?| array['showLifecyclePanel', 'lifecyclePanel', 'simpleDiagram']
    `);
  }

  public down(queryRunner: QueryRunner): Promise<void> {
    void queryRunner;
    // Lifecycle copy is web-only; no restore from migration.
    return Promise.resolve();
  }
}

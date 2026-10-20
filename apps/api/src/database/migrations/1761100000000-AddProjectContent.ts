import { MigrationInterface, QueryRunner } from 'typeorm';

function htmlToPlain(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|li|div|h[1-6])>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export class AddProjectContent1761100000000 implements MigrationInterface {
  name = 'AddProjectContent1761100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "projects"
      ADD COLUMN "content" text NOT NULL DEFAULT ''
    `);

    const rows: { id: string; description: string }[] = await queryRunner.query(
      `SELECT "id", "description" FROM "projects"`,
    );

    for (const row of rows) {
      const description = row.description ?? '';
      await queryRunner.query(
        `UPDATE "projects" SET "content" = $1, "description" = $2 WHERE "id" = $3`,
        [description, htmlToPlain(description), row.id],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "projects"
      SET "description" = "content"
      WHERE "content" <> ''
    `);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "content"`);
  }
}

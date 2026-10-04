import './load-env';
import { AppDataSource } from './data-source';

async function main(): Promise<void> {
  await AppDataSource.initialize();
  const executed = await AppDataSource.runMigrations();
  await AppDataSource.destroy();

  if (executed.length === 0) {
    console.log('No pending migrations.');
    return;
  }

  for (const migration of executed) {
    console.log(`Applied migration: ${migration.name}`);
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

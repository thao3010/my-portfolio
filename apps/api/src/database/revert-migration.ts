import './load-env';
import { AppDataSource } from './data-source';

async function main(): Promise<void> {
  await AppDataSource.initialize();
  await AppDataSource.undoLastMigration();
  await AppDataSource.destroy();
  console.log('Reverted last migration.');
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

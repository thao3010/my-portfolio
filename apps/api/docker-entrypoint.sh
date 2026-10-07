#!/bin/sh
set -eu

find dist/database/migrations -name '*.ts' -delete

node <<'NODE'
const { AppDataSource } = require('./dist/database/data-source');

AppDataSource.initialize()
  .then(() => AppDataSource.runMigrations())
  .then(async (executed) => {
    if (executed.length === 0) {
      console.log('No pending migrations.');
    } else {
      for (const migration of executed) {
        console.log(`Applied migration: ${migration.name}`);
      }
    }
    await AppDataSource.destroy();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
NODE

exec node dist/main.js

import 'dotenv/config';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import log from '@/lib/logger';
async function runMigrations() {
  log.info('Fetching Database');
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }
  const pool = postgres(DATABASE_URL, { max: 1 });
  const db: PostgresJsDatabase = drizzle(pool);

  log.info('Applying Migrations');
  // This will run migrations on the database, skipping the ones already applied
  await migrate(db, { migrationsFolder: './migrations' });
  log.info('Migration Finished');
  // Don't forget to close the connection, otherwise the script will hang
  await pool.end();
}

runMigrations();

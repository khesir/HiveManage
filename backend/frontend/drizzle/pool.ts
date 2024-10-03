import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import 'dotenv/config';
import log from '@/lib/logger';
import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const pool = postgres(DATABASE_URL, { max: 1 });
const db: PostgresJsDatabase = drizzle(pool);
log.info('Database is now up');

export { db, pool };

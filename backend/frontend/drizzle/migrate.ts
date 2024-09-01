import 'dotenv/config';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { pool, db } from '../mysql/mysql.pool';

async function main() {
  await migrate(db, {
    migrationsFolder: './drizzle/migrations',
  });
  await pool.end();
}

main();

import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/mysql2/driver';
import { createPool, Pool } from 'mysql2/promise';

dotenv.config();

// Database configuration
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
};

export const pool: Pool = createPool(config);

export const db = drizzle(pool);

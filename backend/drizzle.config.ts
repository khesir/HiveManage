import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not defined. Please set it in your .env file.',
  );
}

export default defineConfig({
  schema: './drizzle/schema/**',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

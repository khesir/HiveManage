import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import 'dotenv/config';
import log from '@/lib/logger';
import postgres from 'postgres';

class Database {
  private static instance: Database | null = null;
  private db: PostgresJsDatabase | null = null;
  private pool: postgres.Sql;

  private constructor() {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      throw new Error(
        'DATABASE_URL is not defined in the environment variables.',
      );
    }
    this.pool = postgres(DATABASE_URL, { max: 1 });
  }

  // Method to get the singleton instance of the Database class
  public static getInstance(): Database {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }

  // Method to get the Drizzle database instance
  public getDb(): PostgresJsDatabase {
    if (!this.db) {
      throw new Error(
        'Database is not connected. Please initialize the database first.',
      );
    }
    return this.db;
  }

  // Method to connect to the database and initialize the Drizzle instance
  public async connect(): Promise<PostgresJsDatabase> {
    if (!this.db) {
      try {
        this.db = drizzle(this.pool);
        log.info('Database connected successfully.');
      } catch (error) {
        log.error('Failed to connect to the database:', error);
        process.exit(1);
      }
    }
    return this.db;
  }

  public async disconnect(): Promise<void> {
    if (this.pool) {
      try {
        await this.pool.end(); // Properly close the migration client
        this.db = null; // Reset db instance
        log.info('Database connection closed successfully.');
      } catch (error) {
        log.error('Failed to disconnect from the database:', error);
      }
    }
  }
}

export default Database;

import dotenv from 'dotenv'
import { createPool, Pool } from 'mysql2/promise';
import log from '../util/logger';

dotenv.config()


log.info('DB_HOST:', process.env.DB_HOST);
log.info('USER:', process.env.USER);
log.info('PASSWORD:', process.env.PASSWORD);
log.info('DB_NAME:', process.env.DB_NAME);

// Database configuration
const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306
};

// Create a MySQL connection pool
const pool: Pool = createPool(config);

// Export the pool for use in other parts of the application
export default pool;
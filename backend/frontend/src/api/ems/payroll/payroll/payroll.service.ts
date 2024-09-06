import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { payroll } from '../../../../../drizzle/drizzle.schema';

export class PayrollService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createPayroll(data: object) {
    await this.db.insert(payroll).values(data);
  }
}

import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { payroll } from '../../../../../drizzle/drizzle.schema';
import { eq } from 'drizzle-orm';

export class PayrollService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createPayroll(data: object) {
    await this.db.insert(payroll).values(data);
  }

  async updatePayrolls(data: object, paramsId: number) {
    await this.db
      .update(payroll)
      .set(data)
      .where(eq(payroll.payroll_id, paramsId));
  }
}

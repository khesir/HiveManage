import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { payrollReports } from '../../../../../drizzle/drizzle.schema';
import { eq } from 'drizzle-orm';

export class PayrollReportsService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }
  async updatePayrollReports(data: object, paramsId: number) {
    await this.db
      .update(payrollReports)
      .set(data)
      .where(eq(payrollReports.payroll_report, paramsId));
  }
}

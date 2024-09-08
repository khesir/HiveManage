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

  async getAllPayroll(approvalStatus: string | undefined) {
    if (
      approvalStatus &&
      ['active', 'inactive', 'inprogress'].includes(approvalStatus)
    ) {
      const result = await this.db
        .select()
        .from(payroll)
        .where(
          eq(
            payroll.status,
            approvalStatus as 'active' | 'inactive' | 'inprogress',
          ),
        );
      return result;
    } else {
      const result = await this.db.select().from(payroll);
      return result;
    }
  }

  async getPayrollById(paramsId: number) {
    const result = await this.db
      .select()
      .from(payroll)
      .where(eq(payroll.payroll_id, paramsId));
    return result[0];
  }

  async deletePayroll(paramsId: number): Promise<void> {
    await this.db
      .update(payroll)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(payroll.payroll_id, paramsId));
  }
}

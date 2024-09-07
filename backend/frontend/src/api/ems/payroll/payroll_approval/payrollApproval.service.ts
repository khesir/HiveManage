import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { payrollApproval } from '../../../../../drizzle/drizzle.schema';

export class PayrollApprovalService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createPayrollApproval(data: object) {
    await this.db.insert(payrollApproval).values(data);
  }

  async getPayrollApproval(paramsID: number, queryId: number) {
    if (!isNaN(queryId)) {
      const result = await this.db
        .select()
        .from(payrollApproval)
        .where(eq(payrollApproval.on_payroll_id, queryId));
      return result;
    } else if (!isNaN(paramsID)) {
      const result = await this.db
        .select()
        .from(payrollApproval)
        .where(eq(payrollApproval.payroll_approval_id, paramsID));
      return result;
    } else {
      const result = await this.db.select().from(payrollApproval);
      return result;
    }
  }

  async getAllPayrollApprovals(on_payroll_id: number | undefined) {
    if (on_payroll_id) {
      const result = await this.db
        .select()
        .from(payrollApproval)
        .where(eq(payrollApproval.on_payroll_id, on_payroll_id));
      return result;
    } else {
      const result = await this.db.select().from(payrollApproval);
      return result;
    }
  }

  async updatePayrollApproval(data: object, paramsId: number) {
    await this.db
      .update(payrollApproval)
      .set(data)
      .where(eq(payrollApproval.payroll_approval_id, paramsId));
  }

  async deletePayrollApproval(paramsID: number) {
    await this.db
      .update(payrollApproval)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(payrollApproval.payroll_approval_id, paramsID));
  }
}

import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { onPayroll, payrollReports } from '@/drizzle/drizzle.schema';
import { eq } from 'drizzle-orm';

export class PayrollReportsService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }
  async updatePayrollReports(data: object, paramsId: number) {
    await this.db
      .update(payrollReports)
      .set(data)
      .where(eq(payrollReports.payroll_report, paramsId));
  }

  async createPayrollReports(data: object) {
    await this.db.insert(payrollReports).values(data);
  }

  async getAllPayrollReports(id?: number) {
    if (id) {
      const result = await this.db
        .select()
        .from(payrollReports)
        .where(eq(payrollReports.payroll_report, id)); // Filtering by id
      return result;
    } else {
      const result = await this.db.select().from(payrollReports);
      return result;
    }
  }

  async getPayrollReportsById(paramsId: number) {
    const result = await this.db
      .select()
      .from(payrollReports)
      .where(eq(payrollReports.payroll_report, paramsId));
    console.log('Result from database:', result);
    return result[0];
  }

  async getPayrollReportsByOnPayrollId(paramsId: number) {
    const result = await this.db
      .select({
        onPayroll: onPayroll.on_payroll_id,
        payrollData: payrollReports,
      })
      .from(payrollReports)
      .innerJoin(
        onPayroll,
        eq(payrollReports.payroll_report, onPayroll.on_payroll_id),
      )
      .where(eq(payrollReports.payroll_report, paramsId));
    return result[0];
  }

  async deletePayrollReports(paramsId: number): Promise<void> {
    await this.db
      .update(payrollReports)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(payrollReports.payroll_report, paramsId));
  }
}

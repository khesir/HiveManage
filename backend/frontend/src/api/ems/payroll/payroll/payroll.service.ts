import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { payroll } from '@/drizzle/drizzle.schema';
import { eq, and, isNull, sql, asc, desc } from 'drizzle-orm';

export class PayrollService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
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

  async getAllPayroll(
    limit: number,
    sort: string,
    offset: number,
    approvalStatus: string | undefined,
  ) {
    const conditions = [isNull(payroll.deleted_at)];

    if (
      approvalStatus &&
      ['Active', 'Inactive', 'Inprogress'].includes(approvalStatus)
    ) {
      conditions.push(
        eq(
          payroll.status,
          approvalStatus as 'Active' | 'Inactive' | 'Inprogress',
        ),
      );
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(payroll)
      .where(and(...conditions));
    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(payroll)
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(payroll.created_at) : desc(payroll.created_at),
      )
      .limit(limit)
      .offset(offset);

    return {
      totalData,
      result,
    };
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

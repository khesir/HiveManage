import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { eq, and, isNull } from 'drizzle-orm';
import { deductions } from '@/drizzle/drizzle.schema';

export class DeductionsService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createDeductions(data: object) {
    await this.db.insert(deductions).values(data);
  }

  async updateDeductions(data: object, paramsId: number) {
    await this.db
      .update(deductions)
      .set(data)
      .where(eq(deductions.deduction_id, paramsId));
  }

  async getAllDeductions(paramsId: number, queryId: number) {
    if (!isNaN(queryId)) {
      const result = await this.db
        .select()
        .from(deductions)
        .where(eq(deductions.deduction_id, queryId));
      return result;
    } else if (!isNaN(paramsId)) {
      const result = await this.db
        .select()
        .from(deductions)
        .where(
          and(
            eq(deductions.employee_id, paramsId),
            isNull(deductions.deleted_at), // Exclude soft deleted data
          ),
        );
      return result;
    } else {
      const result = await this.db
        .select()
        .from(deductions)
        .where(isNull(deductions.deleted_at));
      return result;
    }
  }

  async getDeductionsById(paramsId: number) {
    const result = await this.db
      .select()
      .from(deductions)
      .where(
        and(
          eq(deductions.deduction_id, paramsId),
          isNull(deductions.deleted_at), // Excluded soft deleted data for general query
        ),
      );
    return result;
  }

  async deleteDeductions(paramsId: number): Promise<void> {
    await this.db
      .update(deductions)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(deductions.deduction_id, paramsId));
  }
}

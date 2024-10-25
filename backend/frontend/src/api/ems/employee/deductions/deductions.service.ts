import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { eq, and, isNull, isNotNull } from 'drizzle-orm';
import { deductions, SchemaType } from '@/drizzle/drizzle.schema';
import { CreateDeductions, UpdateDeductions } from './deductions.model';

export class DeductionsService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createDeductions(data: CreateDeductions) {
    await this.db.insert(deductions).values(data);
  }

  async updateDeductions(
    data: UpdateDeductions,
    deduction_id: string,
    employee_id: string,
  ) {
    await this.db
      .update(deductions)
      .set(data)
      .where(
        and(
          eq(deductions.deduction_id, Number(deduction_id)),
          eq(deductions.employee_id, Number(employee_id)),
        ),
      );
  }

  async getAllDeductions(
    deductionType: string | undefined,
    employee_id: string | undefined,
  ) {
    const condition = [isNull(deductions.deleted_at)];
    if (deductionType) {
      condition.push(eq(deductions.deduction_type, deductionType));
    }
    if (employee_id) {
      condition.push(eq(deductions.employee_id, Number(employee_id)));
    }
    const result = await this.db
      .select()
      .from(deductions)
      .where(and(...condition));
    return result;
  }

  async getDeductionsById(deduction_id: string, employee_id: string) {
    const result = await this.db
      .select()
      .from(deductions)
      .where(
        and(
          eq(deductions.deduction_id, Number(deduction_id)),
          eq(deductions.employee_id, Number(employee_id)),
          isNull(deductions.deleted_at),
        ),
      );
    return result;
  }

  async deleteDeductions(deduction_id: string, employee_id: string) {
    await this.db
      .update(deductions)
      .set({ deleted_at: new Date(Date.now()) })
      .where(
        and(
          eq(deductions.deduction_id, Number(deduction_id)),
          eq(deductions.employee_id, Number(employee_id)),
          isNotNull(deductions.deduction_id),
        ),
      );
  }
}

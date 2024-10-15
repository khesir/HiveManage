import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { adjustments } from '@/drizzle/drizzle.schema';
import { eq, isNull, and } from 'drizzle-orm';
import { CreateAdjustments, UpdateAdjustments } from './adjustments.model';

export class AdjustmentsService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createAdjustments(data: CreateAdjustments) {
    await this.db.insert(adjustments).values(data);
  }

  async updateAdjustments(
    data: UpdateAdjustments,
    adjustment_id: string,
    employee_id: string,
  ) {
    await this.db
      .update(adjustments)
      .set(data)
      .where(
        and(
          eq(adjustments.adjustments_id, Number(adjustment_id)),
          eq(adjustments.employee_id, Number(employee_id)),
        ),
      );
  }

  async getAdjustmentsById(adjustment_id: string, employee_id: string) {
    const result = await this.db
      .select()
      .from(adjustments)
      .where(
        and(
          eq(adjustments.adjustments_id, Number(adjustment_id)),
          eq(adjustments.employee_id, Number(employee_id)),
        ),
      );
    return result;
  }

  async getAllAdjustments(employee_id: string) {
    const result = await this.db
      .select()
      .from(adjustments)
      .where(
        and(
          eq(adjustments.employee_id, Number(employee_id)),
          isNull(adjustments.deleted_at),
        ),
      );
    return result;
  }

  async deleteAdjustments(adjustment_id: string, employee_id: string) {
    await this.db
      .update(adjustments)
      .set({ deleted_at: new Date(Date.now()) })
      .where(
        and(
          eq(adjustments.adjustments_id, Number(adjustment_id)),
          eq(adjustments.employee_id, Number(employee_id)),
        ),
      );
  }
}

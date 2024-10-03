import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { adjustments } from '@/drizzle/drizzle.schema';
import { eq, isNull, and } from 'drizzle-orm';

export class AdjustmentsService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createAdjustments(data: object) {
    await this.db.insert(adjustments).values(data);
  }

  async updateAdjustments(data: object, paramsId: number) {
    await this.db
      .update(adjustments)
      .set(data)
      .where(eq(adjustments.adjustments_id, paramsId));
  }

  async getAdjustmentsById(paramsId: number) {
    const result = await this.db
      .select()
      .from(adjustments)
      .where(eq(adjustments.adjustments_id, paramsId));
    return result;
  }

  async getAllAdjustments(paramsId: number, queryId: number) {
    if (!isNaN(queryId)) {
      const result = await this.db
        .select()
        .from(adjustments)
        .where(eq(adjustments.adjustments_id, queryId));
      return result;
    } else if (!isNaN(paramsId)) {
      const result = await this.db
        .select()
        .from(adjustments)
        .where(
          and(
            eq(adjustments.employee_id, paramsId),
            isNull(adjustments.deleted_at), // Exclude soft deleted data
          ),
        );
      return result;
    } else {
      const result = await this.db
        .select()
        .from(adjustments)
        .where(isNull(adjustments.deleted_at));
      return result;
    }
  }

  async deleteAdjustments(paramsId: number): Promise<void> {
    await this.db
      .update(adjustments)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(adjustments.adjustments_id, paramsId));
  }
}

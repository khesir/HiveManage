import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { additionalPay } from '@/drizzle/drizzle.schema';
import { eq, and, isNull } from 'drizzle-orm';

export class AdditionalPayService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createAdditionalPay(data: object) {
    await this.db.insert(additionalPay).values(data);
  }

  async updateAdditionalPay(data: object, paramsId: number) {
    await this.db
      .update(additionalPay)
      .set(data)
      .where(eq(additionalPay.additional_pay_id, paramsId));
  }

  async getAllAdditionalPay(paramsId: number, queryId: number) {
    if (!isNaN(queryId)) {
      const result = await this.db
        .select()
        .from(additionalPay)
        .where(eq(additionalPay.additional_pay_id, queryId));
      return result;
    } else if (!isNaN(paramsId)) {
      const result = await this.db
        .select()
        .from(additionalPay)
        .where(
          and(
            eq(additionalPay.employee_id, paramsId),
            isNull(additionalPay.deleted_at),
          ),
        );
      return result;
    } else {
      const result = await this.db
        .select()
        .from(additionalPay)
        .where(isNull(additionalPay.deleted_at));
      return result;
    }
  }

  async getAdditionalPayById(paramsId: number) {
    const result = await this.db
      .select()
      .from(additionalPay)
      .where(
        and(
          eq(additionalPay.additional_pay_id, paramsId),
          isNull(additionalPay.deleted_at),
        ),
      );
    return result;
  }

  async deleteAdditionalPay(paramsId: number): Promise<void> {
    await this.db
      .update(additionalPay)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(additionalPay.additional_pay_id, paramsId));
  }
}

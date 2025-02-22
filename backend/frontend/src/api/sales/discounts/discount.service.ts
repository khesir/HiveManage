import { and, eq, isNull, sql, desc, asc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { discount } from '@/drizzle/schema/ims';
import { CreateDiscount } from './discount.model';

export class DiscountService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createDiscount(data: CreateDiscount) {
    await this.db.insert(discount).values(data);
  }

  async getAllDiscount(sort: string, limit: number, offset: number) {
    const conditions = [isNull(discount.deleted_at)];

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(discount)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(discount)
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(discount.created_at) : desc(discount.created_at),
      )
      .limit(limit)
      .offset(offset);

    return {
      totalData,
      result,
    };
  }

  async getDiscountById(paramsId: number) {
    const result = await this.db
      .select()
      .from(discount)
      .where(eq(discount.discount_id, paramsId));
    return result[0];
  }

  async updateDiscount(data: object, paramsId: number) {
    await this.db
      .update(discount)
      .set(data)
      .where(eq(discount.discount_id, paramsId));
  }

  async deleteDiscount(discount_id: number): Promise<void> {
    await this.db
      .update(discount)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(discount.discount_id, discount_id));
  }
}

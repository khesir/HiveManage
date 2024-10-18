import { and, eq, isNull, sql } from 'drizzle-orm';
import { sales_items } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class SalesItemService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createSalesItem(data: object) {
    await this.db.insert(sales_items).values(data);
  }

  async getAllSalesItem(
    sales_item_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(sales_items.deleted_at)];

    if (sales_item_id) {
      conditions.push(eq(sales_items.sales_items_id, Number(sales_item_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(sales_items)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(sales_items)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);
    return { totalData, result };
  }

  async getSalesItemById(paramsId: number) {
    const result = await this.db
      .select()
      .from(sales_items)
      .where(eq(sales_items.sales_items_id, paramsId));
    return result[0];
  }

  async updateSalesItem(data: object, paramsId: number) {
    await this.db
      .update(sales_items)
      .set(data)
      .where(eq(sales_items.sales_items_id, paramsId));
  }

  async deleteSalesItem(paramsId: number): Promise<void> {
    await this.db
      .update(sales_items)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(sales_items.sales_items_id, paramsId));
  }
}

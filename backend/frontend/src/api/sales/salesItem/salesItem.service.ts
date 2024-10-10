import { and, eq, isNull } from 'drizzle-orm';
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
    try {
      if (sales_item_id) {
        const result = await this.db
          .select()
          .from(sales_items)
          .where(
            and(
              eq(sales_items.sales_items_id, Number(sales_item_id)),
              isNull(sales_items.deleted_at),
            ),
          )
          .limit(limit)
          .offset(offset);
        return result;
      } else {
        const result = await this.db
          .select()
          .from(sales_items)
          .where(isNull(sales_items.deleted_at))
          .limit(limit)
          .offset(offset);
        return result;
      }
    } catch (error) {
      console.error('Error fetching sales item: ', error);
      throw new Error('Error fetching sales item');
    }
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

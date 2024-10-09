import { and, eq, isNull } from 'drizzle-orm';
import { sales } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class SalesService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createSales(data: object) {
    await this.db.insert(sales).values(data);
  }

  async getAllSales(
    sales_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    try {
      if (sales_id) {
        // Query by supplierId with limit and offset
        const result = await this.db
          .select()
          .from(sales)
          .where(
            and(eq(sales.sales_id, Number(sales_id)), isNull(sales.deleted_at)),
          )
          .limit(limit)
          .offset(offset);
        return result;
      } else {
        //Query all suppliers with limit and offset
        const result = await this.db
          .select()
          .from(sales)
          .where(isNull(sales.deleted_at))
          .limit(limit)
          .offset(offset);
        return result;
      }
    } catch (error) {
      console.error('Error fetching sales: ', error);
      throw new Error('Error fetching sales');
    }
  }

  async getSalesById(paramsId: number) {
    const result = await this.db
      .select()
      .from(sales)
      .where(eq(sales.sales_id, paramsId));
    return result[0];
  }

  async updateSales(data: object, paramsId: number) {
    await this.db.update(sales).set(data).where(eq(sales.sales_id, paramsId));
  }

  async deleteSales(paramsId: number): Promise<void> {
    await this.db
      .update(sales)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(sales.sales_id, paramsId));
  }
}

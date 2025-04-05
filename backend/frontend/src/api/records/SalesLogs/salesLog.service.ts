import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { SchemaType } from '@/drizzle/schema/type';
import { salesLog } from '@/drizzle/schema/records/schema/salesLog';
import { sales, salesItems } from '@/drizzle/schema/sales';
import { payment } from '@/drizzle/schema/payment';

export class SalesLogService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createSalesLog(data: object) {
    await this.db.insert(salesLog).values(data);
  }

  async getAllSalesLog(
    sales_id: string | undefined,
    payment_id: string | undefined,
    sales_items_id: string | undefined,
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(salesLog.deleted_at)];

    if (sales_id) {
      conditions.push(eq(salesLog.sales_id, Number(sales_id)));
    }

    if (payment_id) {
      conditions.push(eq(salesLog.payment_id, Number(payment_id)));
    }

    if (sales_items_id) {
      conditions.push(eq(salesLog.sales_items_id, Number(sales_items_id)));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(salesLog)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(salesLog)
      .leftJoin(sales, eq(sales.sales_id, salesLog.sales_id))
      .leftJoin(payment, eq(payment.payment_id, salesLog.payment_id))
      .leftJoin(
        salesItems,
        eq(salesItems.sales_items_id, salesLog.sales_items_id),
      )
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(salesLog.created_at) : desc(salesLog.created_at),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const saleslogWithDetails = result.map((row) => ({
      ...row.salesLog,
      sales: {
        ...row.sales,
      },
      payment: {
        ...row.payment,
      },
      salesItems: {
        ...row.sales_items,
      },
    }));

    return { totalData, saleslogWithDetails };
  }
}

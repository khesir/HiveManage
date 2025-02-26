import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateSalesItem } from './salesItem.model';
import { product } from '@/drizzle/schema/ims';
import { SchemaType } from '@/drizzle/schema/type';
import { sales, salesItems } from '@/drizzle/schema/sales';

export class SalesItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createSalesItem(data: CreateSalesItem) {
    await this.db.insert(salesItems).values(data);
  }

  async getAllSalesItem(
    product_id: string | undefined,
    sales_item_status: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(salesItems.deleted_at)];

    if (sales_item_status) {
      const validStatuses = [
        'Sales',
        'Job Order',
        'Borrow',
        'Purchase',
      ] as const;
      if (
        validStatuses.includes(
          sales_item_status as (typeof validStatuses)[number],
        )
      ) {
        conditions.push(
          eq(
            salesItems.salesItem_type,
            sales_item_status as (typeof validStatuses)[number],
          ),
        );
      } else {
        throw new Error(`Invalid item status: ${sales_item_status}`);
      }
    }

    if (product_id !== undefined && !isNaN(Number(product_id))) {
      conditions.push(eq(salesItems.product_id, Number(product_id)));
    }

    const totalCountQuery = await this.db
      .select({ count: sql<number>`COUNT(*)` })
      .from(salesItems)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(salesItems)
      .leftJoin(product, eq(product.product_id, salesItems.product_id))
      .leftJoin(sales, eq(sales.sales_id, salesItems.sales_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(salesItems.created_at)
          : desc(salesItems.created_at),
      )
      .limit(limit)
      .offset(offset);

    const salesitemWithDetails = result.map((row) => ({
      ...row.sales_items,
      product: {
        ...row.product,
      },
      sales: {
        ...row.sales,
      },
    }));

    return { totalData, salesitemWithDetails };
  }

  async getSalesItemById(sales_item_id: number) {
    const result = await this.db
      .select()
      .from(salesItems)
      .leftJoin(product, eq(product.product_id, salesItems.product_id))
      .leftJoin(sales, eq(sales.sales_id, salesItems.sales_id))
      .where(eq(salesItems.sales_items_id, Number(sales_item_id)));

    const salesItemWithDetails = result.map((row) => ({
      ...row.sales_items,
      product: {
        ...row.product,
      },
      sales: {
        ...row.sales,
      },
    }));

    return salesItemWithDetails;
  }

  async updateSalesItem(data: object, paramsId: number) {
    await this.db
      .update(salesItems)
      .set(data)
      .where(eq(salesItems.sales_items_id, paramsId));
  }

  async deleteSalesItem(paramsId: number): Promise<void> {
    await this.db
      .update(salesItems)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(salesItems.sales_items_id, paramsId));
  }
}

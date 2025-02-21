import { and, eq, isNull, asc, desc, sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { customer } from '@/drizzle/schema/customer';
import { SchemaType } from '@/drizzle/schema/type';
import { CreateSales } from './sales.model';
import { sales } from '@/drizzle/schema/sales';

export class SalesService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createSales(data: CreateSales) {
    await this.db.insert(sales).values(data);
  }

  async getAllSales(
    customer_id: string | undefined,
    status: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(sales.deleted_at)];

    if (status) {
      // Define valid statuses as a string union type
      const validStatuses = [
        'Cancelled',
        'Partially Completed',
        'Pending',
        'Completed',
      ] as const; // 'as const' infers a readonly tuple of strings
      if (validStatuses.includes(status as (typeof validStatuses)[number])) {
        conditions.push(
          eq(sales.status, status as (typeof validStatuses)[number]),
        );
      } else {
        throw new Error(`Invalid payment status: ${status}`);
      }
    }
    if (customer_id) {
      conditions.push(eq(sales.customer_id, Number(customer_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(sales)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(sales)
      .leftJoin(customer, eq(customer.customer_id, sales.customer_id))
      .where(and(...conditions))
      .orderBy(sort === 'asc' ? asc(sales.created_at) : desc(sales.created_at))
      .limit(limit)
      .offset(offset);
    const salesWithDetails = result.map((row) => ({
      ...row.sales,
      customer: {
        ...row.customer,
      },
    }));

    return { totalData, salesWithDetails };
  }

  async getSalesById(sales_id: number) {
    const result = await this.db
      .select()
      .from(sales)
      .leftJoin(customer, eq(customer.customer_id, sales.customer_id))
      .where(eq(sales.sales_id, Number(sales_id)));

    const salesWithDetails = result.map((row) => ({
      ...row.sales,
      customer: {
        ...row.customer,
      },
    }));

    return salesWithDetails;
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

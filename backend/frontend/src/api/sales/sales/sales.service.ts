import { and, eq, isNull, asc, desc, sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { customer } from '@/drizzle/schema/customer';
import { SchemaType } from '@/drizzle/schema/type';
import { CreateSales } from './sales.model';
import { sales, salesItems } from '@/drizzle/schema/sales';

export class SalesService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createSales(data: CreateSales) {
    return this.db.transaction(async (tx) => {
      const validStandings = [
        'Active',
        'Inactive',
        'Pending',
        'Suspended',
        'Banned',
        'VIP',
        'Delinquent',
        'Prospect',
      ] as const;
      type Standing = (typeof validStandings)[number];
      const defaultStanding: Standing = 'Active';

      const customer_id =
        data.customer?.customer_id ??
        (
          await tx
            .insert(customer)
            .values({
              ...data.customer,
              standing: validStandings.includes(
                data.customer?.standing as Standing,
              )
                ? (data.customer?.standing as Standing)
                : defaultStanding,
            })
            .returning({ customer_id: customer.customer_id })
        )[0].customer_id;

      const [newSales] = await tx
        .insert(sales)
        .values({
          status: data.status,
          customer_id,
        })
        .returning({ sales_id: sales.sales_id });

      for (const item of data.salesItem) {
        await tx.insert(salesItems).values({
          sales_id: newSales.sales_id,
          ...item,
        });
      }

      return {
        sales_id: newSales.sales_id,
        customer_id,
      };
    });
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
      const validStatuses = [
        'Cancelled',
        'Partially Completed',
        'Completed',
      ] as const;
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
    console.log(paramsId);
    console.log(data);
  }

  async deleteSales(paramsId: number): Promise<void> {
    await this.db
      .update(sales)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(sales.sales_id, paramsId));
  }
}

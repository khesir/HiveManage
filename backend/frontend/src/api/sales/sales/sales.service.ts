import { and, eq, isNull, asc, desc, sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { customer } from '@/drizzle/schema/customer';
import { SchemaType } from '@/drizzle/schema/type';
import { CreateSales } from './sales.model';
import { sales, salesItems } from '@/drizzle/schema/sales';
import { product, productRecord, serializeProduct } from '@/drizzle/schema/ims';
import { employee } from '@/drizzle/schema/ems';
import { payment } from '@/drizzle/schema/payment';

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
          handled_by: data.handled_by,
          customer_id: customer_id,
          total_price: Math.round(
            data.salesItems.reduce(
              (total, item) => total + (item.total_price || 0),
              0,
            ),
          ),
          product_sold: Math.round(
            data.salesItems.reduce(
              (total, item) => total + (item.quantity || 0),
              0,
            ),
          ),
        })
        .returning({ sales_id: sales.sales_id });
      await tx.insert(payment).values({
        sales_id: newSales.sales_id,
        ...data.payment!,
      });
      for (const item of data.salesItems) {
        await tx.insert(salesItems).values({
          sales_id: newSales.sales_id,
          ...item,
        });

        if (item.product_record_id) {
          await tx
            .update(productRecord)
            .set({
              quantity: sql`${productRecord.quantity} - ${item.quantity}`,
              status: sql`CASE WHEN ${productRecord.quantity} = ${item.quantity} THEN 'Sold' ELSE ${productRecord.status} END`,
            })
            .where(eq(productRecord.product_record_id, item.product_record_id));
        } else if (item.serial_id) {
          await tx
            .update(serializeProduct)
            .set({ status: 'Sold' })
            .where(eq(serializeProduct.serial_id, item.serial_id));
        }
      }

      return {
        sales_id: newSales.sales_id,
        customer_id,
      };
    });
  }

  async getAllSales(
    customer_id: string | undefined,
    employee_id: string | undefined,
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
    if (employee_id) {
      conditions.push(eq(sales.handled_by, Number(employee_id)));
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
      .leftJoin(employee, eq(employee.employee_id, sales.handled_by))
      .where(and(...conditions))
      .orderBy(sort === 'asc' ? asc(sales.created_at) : desc(sales.created_at))
      .limit(limit)
      .offset(offset);
    const salesWithDetails = result.map((row) => ({
      ...row.sales,
      customer: {
        ...row.customer,
      },
      employee: {
        ...row.employee,
      },
    }));

    return { totalData, salesWithDetails };
  }

  async getSalesById(sales_id: number) {
    const result = await this.db
      .select()
      .from(sales)
      .leftJoin(customer, eq(customer.customer_id, sales.customer_id))
      .leftJoin(employee, eq(employee.employee_id, sales.handled_by))
      .leftJoin(payment, eq(payment.sales_id, sales.sales_id))
      .where(eq(sales.sales_id, Number(sales_id)));

    const items = await this.db
      .select()
      .from(salesItems)
      .leftJoin(product, eq(product.product_id, salesItems.product_id))
      .where(eq(salesItems.sales_id, sales_id));

    const salesWithDetails = result.map((row) => ({
      ...row.sales,
      customer: {
        ...row.customer,
      },
      employee: row.employee,
      salesItems: items.map((item) => ({
        ...item.sales_items,
        product: item.product,
      })),
      payment: row.payment,
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

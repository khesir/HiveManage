import {
  and,
  eq,
  isNull,
  asc,
  desc,
  sql,
  inArray,
  lte,
  gte,
} from 'drizzle-orm';
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
      // Create Customer if its not provided
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

      // Create Payment
      const [paymentData] = await tx
        .insert(payment)
        .values({
          ...data.payment!,
        })
        .returning({ payment_id: payment.payment_id });
      // Create new Sales
      const [newSales] = await tx
        .insert(sales)
        .values({
          payment_id: paymentData.payment_id,
          status: data.status,
          handled_by: data.handled_by,
          customer_id: customer_id,
          total_price: Math.round(
            data.salesItems.reduce(
              (total, item) =>
                total + (Number(item.sold_price) || 0) * (item.quantity || 0),
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

      for (const item of data.salesItems) {
        const serialData = item.serializeData
          ? item.serializeData
              .map((serial) => serial.serial_id)
              .filter((id): id is number => id !== undefined)
          : [];
        // Create salesItem
        await tx.insert(salesItems).values({
          sales_id: newSales.sales_id,
          product_id: item.data?.product_id,
          serialize_items: serialData,
          sold_price: Number(item.sold_price),
          quantity: item.quantity,
          warranty_date: new Date(),
        });
        // Update Product
        await tx
          .update(product)
          .set({
            sold_quantity: sql`${product.sold_quantity} + ${item.quantity}`,
            sale_quantity: sql`${product.sale_quantity} - ${item.quantity}`,
          })
          .where(eq(product.product_id, item.data!.product_id!));
        // Create Trail log
        await tx.insert(productRecord).values({
          product_id: item.data!.product_id!,
          quantity: item.quantity,
          status: 'Sold',
          action_type: 'Sold',
          source: 'Sales',
          handled_by: data.handled_by,
        });
        // If serialize and not 0, mark them
        if (item.is_serialize && serialData.length > 0) {
          await tx
            .update(serializeProduct)
            .set({ status: 'Sold' })
            .where(inArray(serializeProduct.serial_id, serialData));
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
    range: string | undefined,
    no_pagination: boolean,
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
    if (range) {
      const now = new Date();
      const date = new Date(now); // clone the current date

      const amount = parseInt(range.slice(0, -1));
      const unit = range.slice(-1).toLowerCase(); // lowercase to accept "D" or "d"

      if (unit === 'd') {
        date.setDate(date.getDate() - amount); // subtract days
      } else if (unit === 'm') {
        date.setMonth(date.getMonth() - amount); // subtract months
      }

      // Conditions: From 'date' (earlier) to 'now' (later)
      conditions.push(gte(sales.created_at, date));
      conditions.push(lte(sales.created_at, now));
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

    const query = this.db
      .select()
      .from(sales)
      .leftJoin(customer, eq(customer.customer_id, sales.customer_id))
      .leftJoin(employee, eq(employee.employee_id, sales.handled_by))
      .leftJoin(payment, eq(payment.payment_id, sales.payment_id))
      .where(and(...conditions))
      .orderBy(sort === 'asc' ? asc(sales.sales_id) : desc(sales.sales_id));

    if (no_pagination) {
      query.limit(limit).offset(offset);
    }
    const result = await query;
    const salesWithDetails = result.map((row) => ({
      ...row.sales,
      customer: {
        ...row.customer,
      },
      employee: {
        ...row.employee,
      },
      payment: {
        ...row.payment,
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
      .leftJoin(payment, eq(payment.payment_id, sales.payment_id))
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

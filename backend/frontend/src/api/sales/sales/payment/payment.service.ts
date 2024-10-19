import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { payment, sales } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { CreatePayment } from './payment.model';

export class PaymentService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createPayment(data: CreatePayment) {
    await this.db.insert(payment).values(data);
  }

  async getAllPayment(
    payment_status: string,
    payment_method: string,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(payment.deleted_at)];

    if (payment_method) {
      // Define valid statuses as a string union type
      const validStatuses = ['Cash', 'Card', 'Online Payment'] as const; // 'as const' infers a readonly tuple of strings
      if (
        validStatuses.includes(payment_method as (typeof validStatuses)[number])
      ) {
        conditions.push(
          eq(
            payment.payment_method,
            payment_method as (typeof validStatuses)[number],
          ),
        );
      } else {
        throw new Error(`Invalid payment status: ${payment_method}`);
      }
    }

    if (payment_status) {
      // Define valid statuses as a string union type
      const validStatuses = [
        'Pending',
        'Completed',
        'Failed',
        'Cancelled',
        'Refunded',
        'Partially Refunded',
        'Overdue',
        'Processing',
        'Declined',
        'Authorized',
      ] as const; // 'as const' infers a readonly tuple of strings
      if (
        validStatuses.includes(payment_status as (typeof validStatuses)[number])
      ) {
        conditions.push(
          eq(
            payment.payment_status,
            payment_status as (typeof validStatuses)[number],
          ),
        );
      } else {
        throw new Error(`Invalid payment status: ${payment_status}`);
      }
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(payment)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(payment)
      .leftJoin(sales, eq(payment.sales_id, payment.payment_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(payment.created_at) : desc(payment.created_at),
      )
      .limit(limit)
      .offset(offset);

    const paymentWithDetails = result.map((row) => ({
      payment_id: row.payment.payment_id,
      sales: {
        sales_id: row.sales?.sales_id,
        employee_id: row.sales?.employee_id,
        customer_id: row.sales?.customer_id,
        total_amount: row.sales?.total_amount,
        created_at: row.sales?.created_at,
        last_updated: row.sales?.last_updated,
        deleted_at: row.sales?.deleted_at,
      },
      amount: row.payment?.amount,
      payment_date: row.payment?.payment_date,
      payment_method: row.payment?.payment_method,
      payment_status: row.payment?.payment_status,
      created_at: row.payment?.created_at,
      last_updated: row.payment?.last_updated,
      deleted_at: row.payment?.deleted_at,
    }));

    return { totalData, paymentWithDetails };
  }

  async getPaymentById(payment_id: number) {
    const result = await this.db
      .select()
      .from(payment)
      .leftJoin(sales, eq(payment.payment_id, sales.sales_id))
      .where(eq(payment.payment_id, Number(payment_id)));

    const paymentWithDetails = result.map((row) => ({
      payment_id: row.payment.payment_id,
      sales: {
        sales_id: row.sales?.sales_id,
        employee_id: row.sales?.employee_id,
        customer_id: row.sales?.customer_id,
        total_amount: row.sales?.total_amount,
        created_at: row.sales?.created_at,
        last_updated: row.sales?.last_updated,
        deleted_at: row.sales?.deleted_at,
      },
      amount: row.payment?.amount,
      payment_date: row.payment?.payment_date,
      payment_method: row.payment?.payment_method,
      payment_status: row.payment?.payment_status,
      created_at: row.payment?.created_at,
      last_updated: row.payment?.last_updated,
      deleted_at: row.payment?.deleted_at,
    }));

    return paymentWithDetails;
  }

  async updatePayment(data: object, paramsId: number) {
    await this.db
      .update(payment)
      .set(data)
      .where(eq(payment.payment_id, paramsId));
  }

  async deletePayment(paramsId: number): Promise<void> {
    await this.db
      .update(payment)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(payment.payment_id, paramsId));
  }
}

import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { CreatePayment } from './payment.model';
import { payment } from '@/drizzle/schema/payment/schema/payment.schema';
import { SchemaType } from '@/drizzle/schema/type';
import { sales } from '@/drizzle/schema/sales';
import { service } from '@/drizzle/schema/services';

export class PaymentService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createPayment(data: CreatePayment) {
    await this.db.insert(payment).values(data);
  }

  async getAllPayment(
    payment_status: string | undefined,
    payment_method: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(payment.deleted_at)];

    if (payment_method) {
      const validStatuses = ['Cash', 'Card', 'Online Payment'] as const;
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
      ] as const;
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
      .leftJoin(service, eq(service.service_id, payment.service_id))
      .leftJoin(sales, eq(sales.sales_id, payment.sales_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(payment.created_at) : desc(payment.created_at),
      )
      .limit(limit)
      .offset(offset);

    const paymentWithDetails = result.map((row) => ({
      ...row.payment,
      service: {
        ...row.service,
      },
      sales: {
        ...row.sales,
      },
    }));

    return { totalData, paymentWithDetails };
  }

  async getPaymentById(payment_id: number) {
    const result = await this.db
      .select()
      .from(payment)
      .leftJoin(service, eq(service.service_id, payment.service_id))
      .leftJoin(sales, eq(sales.sales_id, payment.sales_id))
      .where(eq(payment.payment_id, Number(payment_id)));

    const paymentWithDetails = result.map((row) => ({
      ...row.payment,
      service: {
        ...row.service,
      },
      sales: {
        ...row.sales,
      },
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

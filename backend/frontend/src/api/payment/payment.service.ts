import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { CreatePayment, UpdatePayment } from './payment.model';
import { payment } from '@/drizzle/schema/payment/schema/payment.schema';
import { SchemaType } from '@/drizzle/schema/type';

export class PaymentService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createPayment(data: CreatePayment) {
    await this.db.insert(payment).values(data);
  }

  async getAllPayment(
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
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(payment.created_at) : desc(payment.created_at),
      )
      .limit(limit)
      .offset(offset);

    const paymentWithDetails = result.map((row) => ({
      ...row,
    }));

    return { totalData, paymentWithDetails };
  }

  async getPaymentById(payment_id: number) {
    const result = await this.db
      .select()
      .from(payment)
      .where(eq(payment.payment_id, Number(payment_id)));

    const paymentWithDetails = result.map((row) => ({
      ...row,
    }));

    return paymentWithDetails;
  }

  async updatePayment(data: UpdatePayment, paramsId: number) {
    console.log(`ParamsID: ${paramsId}`, data);
  }

  async deletePayment(paramsId: number): Promise<void> {
    await this.db
      .update(payment)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(payment.payment_id, paramsId));
  }
}

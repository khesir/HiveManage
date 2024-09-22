import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { and, eq, isNull } from 'drizzle-orm';
import { payment } from '@/drizzle/drizzle.schema';

export class PaymentService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createPayment(data: object) {
    await this.db.insert(payment).values(data);
  }

  async getAllPayment(
    payment_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    try {
      if (payment_id) {
        const result = await this.db
          .select()
          .from(payment)
          .where(
            and(
              eq(payment.payment_id, Number(payment_id)),
              isNull(payment.deleted_at),
            ),
          )
          .limit(limit)
          .offset(offset);
        return result;
      } else {
        const result = await this.db
          .select()
          .from(payment)
          .where(isNull(payment.deleted_at))
          .limit(limit)
          .offset(offset);
        return result;
      }
    } catch (error) {
      console.error('Error fetching payment: ', error);
      throw new Error('Error fetching payments');
    }
  }

  async getPaymentById(paramsId: number) {
    const result = await this.db
      .select()
      .from(payment)
      .where(eq(payment.payment_id, paramsId));
    return result[0];
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

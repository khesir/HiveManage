import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { payment, receipt, sales } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';

export class ReceiptService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createReceipt(data: object) {
    await this.db.insert(receipt).values(data);
  }

  async getAllReceipt(sort: string, limit: number, offset: number) {
    const conditions = [isNull(receipt.deleted_at)];

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(receipt)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(receipt)
      .leftJoin(sales, eq(receipt.sales_id, receipt.receipt_id))
      .leftJoin(payment, eq(receipt.payment_id, payment.payment_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(receipt.created_at) : desc(receipt.created_at),
      )
      .limit(limit)
      .offset(offset);

    const receiptWithDetails = result.map((row) => ({
      receipt_id: row.receipt.receipt_id,
      sales: {
        sales_id: row.sales?.sales_id,
        employee_id: row.sales?.employee_id,
        customer_id: row.sales?.customer_id,
        total_amount: row.sales?.total_amount,
        created_at: row.sales?.created_at,
        last_updated: row.sales?.last_updated,
        deleted_at: row.sales?.deleted_at,

        payment: {
          payment_id: row.payment?.payment_id,
          sales_id: row.payment?.sales_id,
          amount: row.payment?.amount,
          payment_date: row.payment?.payment_date,
          payment_method: row.payment?.payment_method,
          payment_status: row.payment?.payment_status,
          created_at: row.payment?.created_at,
          last_updated: row.payment?.last_updated,
          deleted_at: row.payment?.deleted_at,
        },
      },
      payment_id: row.receipt?.payment_id,
      issued_date: row.receipt?.issued_date,
      total_amount: row.receipt?.total_amount,
      created_at: row.receipt?.created_at,
      last_updated: row.receipt?.last_updated,
      deleted_at: row.receipt?.deleted_at,
    }));

    return { totalData, receiptWithDetails };
  }

  async getReceiptById(paramsId: number) {
    const result = await this.db
      .select()
      .from(receipt)
      .where(eq(receipt.receipt_id, paramsId));
    return result[0];
  }

  async updateReceipt(data: object, paramsId: number) {
    await this.db
      .update(receipt)
      .set(data)
      .where(eq(receipt.receipt_id, paramsId));
  }

  async deleteReceipt(paramsId: number): Promise<void> {
    await this.db
      .update(receipt)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(receipt.receipt_id, paramsId));
  }
}

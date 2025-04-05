import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { CreateReceipt, UpdateReceipt } from './receipt.model';
import { payment } from '@/drizzle/schema/payment/schema/payment.schema';
import { receipt } from '@/drizzle/schema/payment/schema/receipt.schema';
import { SchemaType } from '@/drizzle/schema/type';

export class ReceiptService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createReceipt(data: CreateReceipt) {
    await this.db.insert(receipt).values(data);
  }

  async getAllReceipt(
    payment_id: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(receipt.deleted_at)];

    if (payment_id) {
      conditions.push(eq(receipt.payment_id, Number(payment_id)));
    }

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
      .leftJoin(payment, eq(receipt.payment_id, payment.payment_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(receipt.created_at) : desc(receipt.created_at),
      )
      .limit(limit)
      .offset(offset);

    const receiptWithDetails = result.map((row) => ({
      receipt_id: row.receipt.receipt_id,
      payment: {
        payment_id: row.payment?.payment_id,
        service_id: row.payment?.service_id,
        sales_id: row.payment?.sales_id,
        service_type: row.payment?.service_type,
        amount: row.payment?.amount,
        vat: row.payment?.vat_rate,
        discount_id: row.payment?.discount_id,
        payment_date: row.payment?.payment_date,
        payment_method: row.payment?.payment_method,
        payment_status: row.payment?.payment_status,
        created_at: row.payment?.created_at,
        last_updated: row.payment?.last_updated,
        deleted_at: row.payment?.deleted_at,
      },
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
      .leftJoin(payment, eq(receipt.payment_id, payment.payment_id))
      .where(eq(receipt.receipt_id, paramsId));
    const receiptWithDetails = result.map((row) => ({
      receipt_id: row.receipt.receipt_id,
      payment: {
        payment_id: row.payment?.payment_id,
        service_id: row.payment?.service_id,
        sales_id: row.payment?.sales_id,
        service_type: row.payment?.service_type,
        amount: row.payment?.amount,
        vat: row.payment?.vat_rate,
        discount_id: row.payment?.discount_id,
        payment_date: row.payment?.payment_date,
        payment_method: row.payment?.payment_method,
        payment_status: row.payment?.payment_status,
        created_at: row.payment?.created_at,
        last_updated: row.payment?.last_updated,
        deleted_at: row.payment?.deleted_at,
      },
      payment_id: row.receipt?.payment_id,
      issued_date: row.receipt?.issued_date,
      total_amount: row.receipt?.total_amount,
      created_at: row.receipt?.created_at,
      last_updated: row.receipt?.last_updated,
      deleted_at: row.receipt?.deleted_at,
    }));

    return receiptWithDetails;
  }

  async updateReceipt(data: UpdateReceipt, paramsId: number) {
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

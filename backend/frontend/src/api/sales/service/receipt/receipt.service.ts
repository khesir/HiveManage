import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import {
  customer,
  employee,
  payment,
  receipt,
  SchemaType,
  service,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { CreateReceipt, UpdateReceipt } from './receipt.model';

export class ReceiptService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createReceipt(data: CreateReceipt) {
    await this.db.insert(receipt).values(data);
  }

  async getAllReceipt(
    service_id: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(receipt.deleted_at)];

    if (service_id) {
      conditions.push(eq(receipt.service_id, Number(service_id)));
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
      .leftJoin(service, eq(receipt.service_id, receipt.receipt_id))
      .leftJoin(payment, eq(receipt.payment_id, payment.payment_id))
      .leftJoin(employee, eq(employee.employee_id, service.employee_id))
      .leftJoin(customer, eq(customer.customer_id, service.customer_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(receipt.created_at) : desc(receipt.created_at),
      )
      .limit(limit)
      .offset(offset);

    const receiptWithDetails = result.map((row) => ({
      receipt_id: row.receipt.receipt_id,
      service: {
        service_id: row.service?.service_id,
        employee: {
          employee_id: row.employee?.employee_id,
          firstname: row.employee?.firstname,
          middlename: row.employee?.middlename,
          lastname: row.employee?.lastname,
          status: row.employee?.status,
          created_at: row.employee?.created_at,
          last_updated: row.employee?.last_updated,
          deleted_at: row.employee?.deleted_at,
        },
        customer: {
          customer_id: row.customer?.customer_id,
          firstname: row.customer?.firstname,
          lastname: row.customer?.lastname,
          contact_phone: row.customer?.contact_phone,
          socials: row.customer?.socials,
          address_line: row.customer?.address_line,
          baranay: row.customer?.address_line,
          province: row.customer?.province,
          standing: row.customer?.standing,
        },
        service_title: row.service?.service_title,
        service_description: row.service?.service_description,
        service_status: row.service?.service_status,
        has_sales_item: row.service?.has_sales_item,
        has_borrow: row.service?.has_borrow,
        has_job_order: row.service?.has_job_order,
        created_at: row.service?.created_at,
        last_updated: row.service?.last_updated,
        deleted_at: row.service?.deleted_at,
      },
      payment: {
        payment_id: row.payment?.payment_id,
        service_id: row.payment?.service_id,
        amount: row.payment?.amount,
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

    return { totalData, receiptWithDetails };
  }

  async getReceiptById(paramsId: number) {
    const result = await this.db
      .select()
      .from(receipt)
      .where(eq(receipt.receipt_id, paramsId));
    return result[0];
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

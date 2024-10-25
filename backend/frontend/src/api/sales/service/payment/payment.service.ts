import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import {
  customer,
  employee,
  payment,
  SchemaType,
  service,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { CreatePayment } from './payment.model';

export class PaymentService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createPayment(data: CreatePayment) {
    await this.db.insert(payment).values(data);
  }

  async getAllPayment(
    service_id: string | undefined,
    payment_status: string | undefined,
    payment_method: string | undefined,
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

    if (service_id) {
      conditions.push(eq(payment.service_id, Number(service_id)));
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
      .leftJoin(service, eq(payment.service_id, payment.payment_id))
      .leftJoin(employee, eq(employee.employee_id, service.employee_id))
      .leftJoin(customer, eq(customer.customer_id, service.customer_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(payment.created_at) : desc(payment.created_at),
      )
      .limit(limit)
      .offset(offset);

    const paymentWithDetails = result.map((row) => ({
      payment_id: row.payment.payment_id,
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
      .leftJoin(service, eq(payment.service_id, payment.payment_id))
      .leftJoin(employee, eq(employee.employee_id, service.employee_id))
      .leftJoin(customer, eq(customer.customer_id, service.customer_id))
      .where(eq(payment.payment_id, Number(payment_id)));

    const paymentWithDetails = result.map((row) => ({
      payment_id: row.payment.payment_id,
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

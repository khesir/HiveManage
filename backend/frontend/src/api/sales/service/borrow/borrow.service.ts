import { and, eq, isNull, sql, desc, asc } from 'drizzle-orm';
import {
  borrow,
  customer,
  employee,
  sales_items,
  SchemaType,
  service,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateBorrow } from './borrow.model';

export class BorrowService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createBorrow(data: CreateBorrow) {
    await this.db.insert(borrow).values(data);
  }

  async getAllBorrow(
    service_id: string | undefined,
    status: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(borrow.deleted_at)];

    if (status) {
      // Define valid statuses as a string union type
      const validStatuses = [
        'Requested',
        'Approved',
        'Borrowed',
        'Returned',
        'Overdue',
        'Rejected',
        'Cancelled',
        'Lost',
        'Damaged',
      ] as const; // 'as const' infers a readonly tuple of strings
      if (validStatuses.includes(status as (typeof validStatuses)[number])) {
        conditions.push(
          eq(borrow.status, status as (typeof validStatuses)[number]),
        );
      } else {
        throw new Error(`Invalid payment status: ${status}`);
      }
    }
    if (service_id) {
      conditions.push(eq(borrow.service_id, Number(service_id)));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(borrow)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(borrow)
      .leftJoin(service, eq(service.service_id, borrow.borrow_id))
      .leftJoin(employee, eq(employee.employee_id, service.employee_id))
      .leftJoin(customer, eq(customer.customer_id, service.customer_id))
      .leftJoin(
        sales_items,
        eq(sales_items.sales_items_id, borrow.sales_item_id),
      )
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(borrow.created_at) : desc(borrow.created_at),
      )
      .limit(limit)
      .offset(offset);

    const borrowWithDetails = result.map((row) => ({
      borrow_id: row.borrow.borrow_id,
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
      sales_items: {
        sales_items_id: row.sales_items?.sales_items_id,
        item_id: row.sales_items?.item_id,
        service_id: row.sales_items?.service_id,
        quantity: row.sales_items?.quantity,
        sales_item_type: row.sales_items?.sales_item_type,
        total_price: row.sales_items?.total_price,
        created_at: row.sales_items?.created_at,
        last_updated: row.sales_items?.last_updated,
        deleted_at: row.sales_items?.deleted_at,
      },
      sales_item_id: row.borrow?.sales_item_id,
      borrow_date: row.borrow?.borrow_date,
      return_date: row.borrow?.return_date,
      fee: row.borrow?.fee,
      status: row.borrow?.status,
      created_at: row.borrow?.created_at,
      last_updated: row.borrow?.last_updated,
      deleted_at: row.borrow?.deleted_at,
    }));

    return { totalData, borrowWithDetails };
  }

  async getBorrowById(borrow_id: number) {
    const result = await this.db
      .select()
      .from(borrow)
      .leftJoin(service, eq(service.service_id, borrow.service_id))
      .leftJoin(employee, eq(employee.employee_id, service.employee_id))
      .leftJoin(customer, eq(customer.customer_id, service.customer_id))
      .leftJoin(
        sales_items,
        eq(sales_items.sales_items_id, borrow.sales_item_id),
      )
      .where(eq(borrow.borrow_id, Number(borrow_id)));
    const borrowWithDetails = result.map((row) => ({
      borrow_id: row.borrow.borrow_id,
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
      sales_items: {
        sales_items_id: row.sales_items?.sales_items_id,
        item_id: row.sales_items?.item_id,
        service_id: row.sales_items?.service_id,
        quantity: row.sales_items?.quantity,
        sales_item_type: row.sales_items?.sales_item_type,
        total_price: row.sales_items?.total_price,
        created_at: row.sales_items?.created_at,
        last_updated: row.sales_items?.last_updated,
        deleted_at: row.sales_items?.deleted_at,
      },
      sales_item_id: row.borrow?.sales_item_id,
      borrow_date: row.borrow?.borrow_date,
      return_date: row.borrow?.return_date,
      fee: row.borrow?.fee,
      status: row.borrow?.status,
      created_at: row.borrow?.created_at,
      last_updated: row.borrow?.last_updated,
      deleted_at: row.borrow?.deleted_at,
    }));

    return borrowWithDetails;
  }

  async updateBorrow(data: object, paramsId: number) {
    await this.db
      .update(borrow)
      .set(data)
      .where(eq(borrow.borrow_id, paramsId));
  }

  async deleteBorrow(paramsId: number): Promise<void> {
    await this.db
      .update(borrow)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(borrow.borrow_id, paramsId));
  }
}

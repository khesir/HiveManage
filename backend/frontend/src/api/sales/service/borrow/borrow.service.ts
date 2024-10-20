import { and, eq, isNull, sql, desc, asc } from 'drizzle-orm';
import { borrow, sales, service } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateBorrow } from './borrow.model';

export class BorrowService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createBorrow(data: CreateBorrow) {
    await this.db.insert(borrow).values(data);
  }

  async getAllBorrow(
    status: string,
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
      .leftJoin(sales, eq(borrow.sales_id, borrow.borrow_id))
      .leftJoin(service, eq(service.service_id, borrow.service_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(borrow.created_at) : desc(borrow.created_at),
      )
      .limit(limit)
      .offset(offset);

    const borrowWithDetails = result.map((row) => ({
      borrow: {
        borrow_id: row.borrow.borrow_id,
        sales: {
          sales_id: row.sales?.sales_id,
          employee_id: row.sales?.employee_id,
          customer_id: row.sales?.customer_id,
          total_amount: row.sales?.total_amount,
          created_at: row.sales?.created_at,
          last_updated: row.sales?.last_updated,
          deleted_at: row.sales?.deleted_at,
        },
        service: {
          service_id: row.service?.service_id,
          sales_id: row.service?.sales_id,
          service_title: row.service?.service_title,
          service_type: row.service?.service_type,
          has_sales_item: row.service?.has_sales_item,
          has_borrow: row.service?.has_borrow,
          has_job_order: row.service?.has_job_order,
          created_at: row.service?.created_at,
          last_updated: row.service?.last_updated,
          deleted_at: row.service?.deleted_at,
        },
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
      .leftJoin(sales, eq(borrow.sales_id, borrow.borrow_id))
      .leftJoin(service, eq(service.service_id, borrow.service_id))
      .where(eq(borrow.borrow_id, Number(borrow_id)));
    const borrowWithDetails = result.map((row) => ({
      borrow: {
        borrow_id: row.borrow.borrow_id,
        sales: {
          sales_id: row.sales?.sales_id,
          employee_id: row.sales?.employee_id,
          customer_id: row.sales?.customer_id,
          total_amount: row.sales?.total_amount,
          created_at: row.sales?.created_at,
          last_updated: row.sales?.last_updated,
          deleted_at: row.sales?.deleted_at,
        },
        service: {
          service_id: row.service?.service_id,
          sales_id: row.service?.sales_id,
          service_title: row.service?.service_title,
          service_type: row.service?.service_type,
          has_sales_item: row.service?.has_sales_item,
          has_borrow: row.service?.has_borrow,
          has_job_order: row.service?.has_job_order,
          created_at: row.service?.created_at,
          last_updated: row.service?.last_updated,
          deleted_at: row.service?.deleted_at,
        },
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

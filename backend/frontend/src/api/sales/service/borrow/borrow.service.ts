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
      ...row.borrow,
      service: {
        ...row.service,
        employee: {
          ...row.employee,
        },
        customer: {
          ...row.customer,
        },
      },
      sales_items: {
        ...row.sales_items,
      },
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
      ...row.borrow,
      service: {
        ...row.service,
        employee: {
          ...row.employee,
        },
        customer: {
          ...row.customer,
        },
      },
      sales_items: {
        ...row.sales_items,
      },
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

import { and, eq, isNull, asc, desc, sql } from 'drizzle-orm';
import { reserve, sales, service } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateReserve } from './reserve.model';
import z from 'zod/lib';

export class ReserveService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createReserve(data: z.infer<typeof CreateReserve>) {
    // Validate the data with Zod schema
    const parsedData = CreateReserve.parse(data);

    // Insert the validated data into the database
    await this.db.insert(reserve).values(parsedData);
  }

  async getAllReserve(
    reserve_status: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(reserve.deleted_at)];

    if (reserve_status) {
      // Define valid statuses as a string union type
      const validStatuses = [
        'Reserved',
        'Confirmed',
        'Cancelled',
        'Pending',
        'Completed',
      ] as const; // 'as const' infers a readonly tuple of strings
      if (
        validStatuses.includes(reserve_status as (typeof validStatuses)[number])
      ) {
        conditions.push(
          eq(
            reserve.reserve_status,
            reserve_status as (typeof validStatuses)[number],
          ),
        );
      } else {
        throw new Error(`Invalid payment status: ${reserve_status}`);
      }
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(reserve)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(reserve)
      .leftJoin(sales, eq(reserve.sales_id, reserve.reserve_id))
      .leftJoin(service, eq(service.service_id, reserve.service_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(reserve.created_at) : desc(reserve.created_at),
      )
      .limit(limit)
      .offset(offset);

    const reserveWithDetails = result.map((row) => ({
      reserve: {
        reserve_id: row.reserve.reserve_id,
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
      item_id: row.reserve?.item_id,
      reserve_status: row.reserve?.reserve_status,
      created_at: row.reserve?.created_at,
      last_updated: row.reserve?.last_updated,
      deleted_at: row.reserve?.deleted_at,
    }));

    return { totalData, reserveWithDetails };
  }

  async getReserveById(reserve_id: number) {
    const result = await this.db
      .select()
      .from(reserve)
      .leftJoin(sales, eq(reserve.sales_id, reserve.reserve_id))
      .leftJoin(service, eq(service.service_id, reserve.service_id))
      .where(eq(reserve.reserve_id, Number(reserve_id)));

    const reserveWithDetails = result.map((row) => ({
      reserve: {
        reserve_id: row.reserve.reserve_id,
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
      item_id: row.reserve?.item_id,
      reserve_status: row.reserve?.reserve_status,
      created_at: row.reserve?.created_at,
      last_updated: row.reserve?.last_updated,
      deleted_at: row.reserve?.deleted_at,
    }));

    return reserveWithDetails;
  }

  async updateReserve(data: object, paramsId: number) {
    await this.db
      .update(reserve)
      .set(data)
      .where(eq(reserve.reserve_id, paramsId));
  }

  async deleteReserve(paramsId: number): Promise<void> {
    await this.db
      .update(reserve)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(reserve.reserve_id, paramsId));
  }
}

import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import {
  jobOrder,
  jobordertype,
  SchemaType,
  service,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateJobOrder, UpdateJobOrder } from './joborder.model';

export class JobOrderService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createJobOrder(data: CreateJobOrder) {
    await this.db.insert(jobOrder).values(data);
  }

  async getAllJobOrder(
    service_id: string | undefined,
    status: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(jobOrder.deleted_at)];

    if (status) {
      // Define valid statuses as a string union type
      const validStatuses = [
        'Pending',
        'In Progress',
        'Completed',
        'On Hold',
        'Cancelled',
        'Awaiting Approval',
        'Approved',
        'Rejected',
        'Closed',
      ] as const; // 'as const' infers a readonly tuple of strings
      if (validStatuses.includes(status as (typeof validStatuses)[number])) {
        conditions.push(
          eq(jobOrder.status, status as (typeof validStatuses)[number]),
        );
      } else {
        throw new Error(`Invalid payment status: ${status}`);
      }
    }
    if (service_id) {
      conditions.push(eq(jobOrder.service_id, Number(service_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(jobOrder)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(jobOrder)
      .leftJoin(
        jobordertype,
        eq(jobordertype.joborder_type_id, jobOrder.joborder_type_id),
      )
      .leftJoin(service, eq(service.service_id, jobOrder.service_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(jobOrder.created_at) : desc(jobOrder.created_at),
      )
      .limit(limit)
      .offset(offset);

    const joborderitemWithDetails = result.map((row) => ({
      joborder_id: row.joborder.job_order_id,
      joborder_type: {
        joborder_type_id: row.jobordertype?.joborder_type_id,
        name: row.jobordertype?.name,
        description: row.jobordertype?.description,
        joborder_types_status: row.jobordertype?.joborder_types_status,
        created_at: row.jobordertype?.created_at,
        last_updated: row.jobordertype?.last_updated,
        deleted_at: row.jobordertype?.deleted_at,
      },
      service: {
        service_id: row.service?.service_id,
        service_title: row.service?.service_title,
        service_description: row.service?.service_description,
        service_status: row.service?.service_status,
        has_reservation: row.service?.has_reservation,
        has_sales_item: row.service?.has_sales_item,
        has_borrow: row.service?.has_borrow,
        has_job_order: row.service?.has_job_order,
        created_at: row.service?.created_at,
        last_updated: row.service?.last_updated,
        deleted_at: row.service?.deleted_at,
      },
      uuid: row.joborder?.uuid,
      fee: row.joborder?.fee,
      status: row.joborder?.status,
      created_at: row.joborder?.created_at,
      last_updated: row.joborder?.last_updated,
      deleted_at: row.joborder?.deleted_at,
    }));

    return { totalData, joborderitemWithDetails };
  }

  async getJobOrderById(job_order_id: number) {
    const result = await this.db
      .select()
      .from(jobOrder)
      .leftJoin(
        jobordertype,
        eq(jobordertype.joborder_type_id, jobOrder.joborder_type_id),
      )
      .leftJoin(service, eq(service.service_id, jobOrder.service_id))
      .where(eq(jobOrder.job_order_id, Number(job_order_id)));
    const joborderitemWithDetails = result.map((row) => ({
      joborder_id: row.joborder.job_order_id,
      joborder_type: {
        joborder_type_id: row.jobordertype?.joborder_type_id,
        name: row.jobordertype?.name,
        description: row.jobordertype?.description,
        joborder_types_status: row.jobordertype?.joborder_types_status,
        created_at: row.jobordertype?.created_at,
        last_updated: row.jobordertype?.last_updated,
        deleted_at: row.jobordertype?.deleted_at,
      },
      service: {
        service_id: row.service?.service_id,
        service_title: row.service?.service_title,
        service_description: row.service?.service_description,
        service_status: row.service?.service_status,
        has_reservation: row.service?.has_reservation,
        has_sales_item: row.service?.has_sales_item,
        has_borrow: row.service?.has_borrow,
        has_job_order: row.service?.has_job_order,
        created_at: row.service?.created_at,
        last_updated: row.service?.last_updated,
        deleted_at: row.service?.deleted_at,
      },
      uuid: row.joborder?.uuid,
      fee: row.joborder?.fee,
      status: row.joborder?.status,
      created_at: row.joborder?.created_at,
      last_updated: row.joborder?.last_updated,
      deleted_at: row.joborder?.deleted_at,
    }));

    return joborderitemWithDetails;
  }

  async updateJobOrder(data: UpdateJobOrder, paramsId: number) {
    await this.db
      .update(jobOrder)
      .set(data)
      .where(eq(jobOrder.job_order_id, paramsId));
  }

  async deleteJobOrder(paramsId: number): Promise<void> {
    await this.db
      .update(jobOrder)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(jobOrder.job_order_id, paramsId));
  }
}

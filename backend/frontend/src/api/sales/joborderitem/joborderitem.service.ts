import { jobOrder, joborderitems, service } from '@/drizzle/drizzle.schema';
import { and, eq, isNull, sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class JobOrderItemService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createJobOrderItems(data: object) {
    await this.db.insert(joborderitems).values(data);
  }

  async getAllJobOrderItems(
    joborderitems_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(joborderitems.deleted_at)];

    if (joborderitems_id) {
      conditions.push(
        eq(joborderitems.joborderitems_id, Number(joborderitems_id)),
      );
    }
    const totalCountQuery = await this.db
      .select({ count: sql<number>`COUNT(*)` })
      .from(joborderitems)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(joborderitems)
      .leftJoin(
        jobOrder,
        eq(joborderitems.joborderitems_id, jobOrder.job_order_id),
      )
      .leftJoin(service, eq(jobOrder.service_id, service.service_id))
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);

    const JobOrderItemsDetails = result.map((row) => ({
      joborderitems_id: row.joborderitems.joborderitems_id,
      item: {
        job_order_id: row.joborder?.job_order_id,
        service: {
          service_id: row.service?.service_id,
          sales_id: row.service?.sales_id,
          service_title: row.service?.service_title,
          service_type: row.service?.service_type,
          created_at: row.service?.created_at,
          last_updated: row.service?.last_updated,
          deleted_at: row.service?.deleted_at,
        },
        created_at: row.joborder?.created_at,
        last_updated: row.joborder?.last_updated,
        deleted_at: row.joborder?.deleted_at,
      },
      item_id: row.joborderitems.item_id,
      quantity: row.joborderitems.quantity,
      created_at: row.joborderitems.created_at,
      last_updated: row.joborderitems.last_updated,
      deleted_at: row.joborderitems.deleted_at,
    }));

    return { totalData, JobOrderItemsDetails };
  }

  async getJobOrderItemsByID(joborderitems_id: string) {
    const result = await this.db
      .select()
      .from(joborderitems)
      .leftJoin(
        jobOrder,
        eq(joborderitems.joborderitems_id, jobOrder.job_order_id),
      )
      .leftJoin(service, eq(jobOrder.service_id, service.service_id))
      .where(eq(joborderitems.joborderitems_id, Number(joborderitems_id)));

    const JobOrderItemsDetails = result.map((row) => ({
      joborderitems_id: row.joborderitems.joborderitems_id,
      jobOrder: {
        job_order_id: row.joborder?.job_order_id,
        service: {
          service_id: row.service?.service_id,
          sales_id: row.service?.sales_id,
          service_title: row.service?.service_title,
          service_type: row.service?.service_type,
          created_at: row.service?.created_at,
          last_updated: row.service?.last_updated,
          deleted_at: row.service?.deleted_at,
        },
        created_at: row.joborder?.created_at,
        last_updated: row.joborder?.last_updated,
        deleted_at: row.joborder?.deleted_at,
      },
      item_id: row.joborderitems.item_id,
      quantity: row.joborderitems.quantity,
      created_at: row.joborderitems.created_at,
      last_updated: row.joborderitems.last_updated,
      deleted_at: row.joborderitems.deleted_at,
    }));
    return JobOrderItemsDetails;
  }

  async updateJobOrderItems(data: object, paramsId: number) {
    await this.db
      .update(joborderitems)
      .set(data)
      .where(eq(joborderitems.joborderitems_id, paramsId));
  }

  async deleteJobOrderItems(paramsId: number): Promise<void> {
    await this.db
      .update(joborderitems)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(joborderitems.joborderitems_id, paramsId));
  }
}

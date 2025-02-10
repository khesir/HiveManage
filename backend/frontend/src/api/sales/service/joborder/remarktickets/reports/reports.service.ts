import { and, eq, isNull, desc, asc, sql } from 'drizzle-orm';
import { jobOrder, reports, SchemaType } from '@/drizzle/drizzle.config';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class ReportsService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createReports(data: object) {
    await this.db.insert(reports).values(data);
  }

  async getAllReports(
    joborder_id: string | undefined,
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(reports.deleted_at)];

    if (joborder_id) {
      conditions.push(eq(jobOrder.job_order_id, Number(joborder_id)));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(reports)
      .leftJoin(jobOrder, eq(jobOrder.job_order_id, reports.job_order_id))
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(reports)
      .leftJoin(jobOrder, eq(jobOrder.job_order_id, reports.job_order_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(reports.created_at) : desc(reports.created_at),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const reportsWithDetails = result.map((row) => ({
      reports_id: row.reports.reports_id,
      jobOrder: {
        jobOrder_id: row.joborder?.job_order_id,
        service_id: row.joborder?.service_id,
        uuid: row.joborder?.uuid,
        fee: row.joborder?.fee,
        joborder_status: row.joborder?.joborder_status,
        total_cost_price: row.joborder?.total_cost_price,
        created_at: row.joborder?.created_at,
        last_updated: row.joborder?.last_updated,
        deleted_at: row.joborder?.deleted_at,
      },
      reports_title: row.reports?.reports_title,
      remarks: row.reports?.remarks,
      created_at: row.reports?.created_at,
      last_updated: row.reports?.last_updated,
      deleted_at: row.reports?.deleted_at,
    }));

    return { totalData, reportsWithDetails };
  }

  async getReportsById(reports_id: number) {
    const result = await this.db
      .select()
      .from(reports)
      .leftJoin(jobOrder, eq(jobOrder.job_order_id, reports.job_order_id))
      .where(eq(reports.reports_id, Number(reports_id)));
    const reportsWithDetails = result.map((row) => ({
      reports: {
        reports_id: row.reports.reports_id,
        jobOrder: {
          jobOrder_id: row.joborder?.job_order_id,
          service_id: row.joborder?.service_id,
          uuid: row.joborder?.uuid,
          fee: row.joborder?.fee,
          joborder_status: row.joborder?.joborder_status,
          created_at: row.joborder?.created_at,
          last_updated: row.joborder?.last_updated,
          deleted_at: row.joborder?.deleted_at,
        },
      },
      reports_title: row.reports?.reports_title,
      remarks: row.reports?.remarks,
      created_at: row.reports?.created_at,
      last_updated: row.reports?.last_updated,
      deleted_at: row.reports?.deleted_at,
    }));

    return reportsWithDetails;
  }

  async updateReports(data: object, paramsId: number) {
    await this.db
      .update(reports)
      .set(data)
      .where(eq(reports.reports_id, paramsId));
  }

  async deleteReports(paramsId: number): Promise<void> {
    await this.db
      .update(reports)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(reports.reports_id, paramsId));
  }
}

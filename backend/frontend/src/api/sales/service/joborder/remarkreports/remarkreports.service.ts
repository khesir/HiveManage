import { and, eq, isNull, sql } from 'drizzle-orm';
import {
  remarkreports,
  remarktickets,
  reports,
  SchemaType,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
  CreateRemarkReports,
  UpdateRemarkReports,
} from './remarkreports.model';

export class RemarkReportsService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createRemarkReports(data: CreateRemarkReports) {
    await this.db.insert(remarkreports).values(data);
  }

  async getAllRemarkReports(
    remark_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(remarkreports.deleted_at)];

    if (remark_id) {
      conditions.push(eq(remarkreports.remark_id, Number(remark_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(remarkreports)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(remarkreports)
      .leftJoin(
        reports,
        eq(reports.reports_id, remarkreports.remark_reports_id),
      )
      .leftJoin(
        remarktickets,
        eq(remarktickets.remark_id, remarkreports.remark_id),
      )
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);

    const remarkreportsWithDetails = result.map((row) => ({
      remark_reports_id: row.remarkreports.remark_reports_id,
      reports: {
        customer_id: row.reports?.customer_id,
        job_order_id: row.reports?.job_order_id,
        reports_title: row.reports?.reports_title,
        remarks: row.reports?.remarks,
        created_at: row.reports?.created_at,
        last_updated: row.reports?.last_updated,
        deleted_at: row.reports?.deleted_at,
      },
      remarktickets: {
        remark_id: row.remarktickets?.remark_id,
        job_order_id: row.remarktickets?.job_order_id,
        created_by: row.remarktickets?.created_by,
        remark_type: row.remarktickets?.remark_type,
        description: row.remarktickets?.description,
        remarktickets_status: row.remarktickets?.remarktickets_status,
        created_at: row.remarktickets?.created_at,
        last_updated: row.remarktickets?.last_updated,
        deleted_at: row.remarktickets?.deleted_at,
      },
      created_at: row.remarkreports?.created_at,
      last_updated: row.remarkreports?.last_updated,
      deleted_at: row.remarkreports?.deleted_at,
    }));

    return { totalData, remarkreportsWithDetails };
  }

  async getRemarkReportsById(remark_reports_id: number) {
    const result = await this.db
      .select()
      .from(remarkreports)
      .leftJoin(
        reports,
        eq(reports.reports_id, remarkreports.remark_reports_id),
      )
      .leftJoin(
        remarktickets,
        eq(remarktickets.remark_id, remarkreports.remark_id),
      )
      .where(eq(remarkreports.remark_reports_id, Number(remark_reports_id)));

    const remarkreportsWithDetails = result.map((row) => ({
      remark_reports_id: row.remarkreports.remark_reports_id,
      reports: {
        customer_id: row.reports?.customer_id,
        job_order_id: row.reports?.job_order_id,
        reports_title: row.reports?.reports_title,
        remarks: row.reports?.remarks,
        created_at: row.reports?.created_at,
        last_updated: row.reports?.last_updated,
        deleted_at: row.reports?.deleted_at,
      },
      remarktickets: {
        remark_id: row.remarktickets?.remark_id,
        job_order_id: row.remarktickets?.job_order_id,
        created_by: row.remarktickets?.created_by,
        remark_type: row.remarktickets?.remark_type,
        description: row.remarktickets?.description,
        remarktickets_status: row.remarktickets?.remarktickets_status,
        created_at: row.remarktickets?.created_at,
        last_updated: row.remarktickets?.last_updated,
        deleted_at: row.remarktickets?.deleted_at,
      },
      created_at: row.remarkreports?.created_at,
      last_updated: row.remarkreports?.last_updated,
      deleted_at: row.remarkreports?.deleted_at,
    }));

    return remarkreportsWithDetails;
  }

  async updateRemarkReports(data: UpdateRemarkReports, paramsId: number) {
    await this.db
      .update(remarkreports)
      .set(data)
      .where(eq(remarkreports.remark_reports_id, paramsId));
  }

  async deleteRemarkReports(paramsId: number): Promise<void> {
    await this.db
      .update(remarkreports)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(remarkreports.remark_reports_id, paramsId));
  }
}

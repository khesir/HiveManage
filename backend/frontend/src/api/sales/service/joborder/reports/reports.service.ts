import { and, eq, isNull, desc, asc, sql } from 'drizzle-orm';
import { customer, jobOrder, reports } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class ReportsService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createReports(data: object) {
    await this.db.insert(reports).values(data);
  }

  async getAllReports(sort: string, limit: number, offset: number) {
    const conditions = [isNull(reports.deleted_at)];

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(reports)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(reports)
      .leftJoin(customer, eq(reports.customer_id, reports.reports_id))
      .leftJoin(jobOrder, eq(jobOrder.job_order_id, reports.job_order_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(reports.created_at) : desc(reports.created_at),
      )
      .limit(limit)
      .offset(offset);

    const reportsWithDetails = result.map((row) => ({
      reports_id: row.reports.reports_id,
      customer: {
        customer_id: row.customer?.customer_id,
        firstname: row.customer?.firstname,
        middlename: row.customer?.middlename,
        lastname: row.customer?.lastname,
        contact_phone: row.customer?.contact_phone,
        socials: row.customer?.socials,
        address_line: row.customer?.address_line,
        barangay: row.customer?.barangay,
        province: row.customer?.province,
        email: row.customer?.email,
        standing: row.customer?.standing,
        created_at: row.customer?.created_at,
        last_updated: row.customer?.last_updated,
        deleted_at: row.customer?.deleted_at,
      },
      jobOrder: {
        jobOrder_id: row.joborder?.job_order_id,
        joborder_type_id: row.joborder?.joborder_type_id,
        service_id: row.joborder?.service_id,
        uuid: row.joborder?.uuid,
        fee: row.joborder?.fee,
        status: row.joborder?.status,
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
      .leftJoin(customer, eq(reports.customer_id, reports.reports_id))
      .leftJoin(jobOrder, eq(jobOrder.job_order_id, reports.job_order_id))
      .where(eq(reports.reports_id, Number(reports_id)));
    const reportsWithDetails = result.map((row) => ({
      reports: {
        reports_id: row.reports.reports_id,
        customer: {
          customer_id: row.customer?.customer_id,
          firstname: row.customer?.firstname,
          middlename: row.customer?.middlename,
          lastname: row.customer?.lastname,
          contact_phone: row.customer?.contact_phone,
          socials: row.customer?.socials,
          address_line: row.customer?.address_line,
          barangay: row.customer?.barangay,
          province: row.customer?.province,
          email: row.customer?.email,
          standing: row.customer?.standing,
          created_at: row.customer?.created_at,
          last_updated: row.customer?.last_updated,
          deleted_at: row.customer?.deleted_at,
        },
        jobOrder: {
          jobOrder_id: row.joborder?.job_order_id,
          joborder_type_id: row.joborder?.joborder_type_id,
          service_id: row.joborder?.service_id,
          uuid: row.joborder?.uuid,
          fee: row.joborder?.fee,
          status: row.joborder?.status,
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

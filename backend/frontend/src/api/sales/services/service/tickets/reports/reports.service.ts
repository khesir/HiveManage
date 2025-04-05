import { reports, service } from '@/drizzle/schema/services';
import { SchemaType } from '@/drizzle/schema/type';
import { and, eq, isNull, desc, asc, sql } from 'drizzle-orm';
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
    service_id: string | undefined,
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(reports.deleted_at)];

    if (service_id) {
      conditions.push(eq(reports.service_id, Number(service_id)));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(reports)
      .leftJoin(service, eq(service.service_id, reports.service_id))
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(reports)
      .leftJoin(service, eq(service.service_id, reports.service_id))
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
      service: {
        service_id: row.service?.service_id,
        service_type_id: row.service?.service_type_id,
        uuid: row.service?.uuid,
        description: row.service?.description,
        fee: row.service?.fee,
        service_status: row.service?.service_status,
        total_cost_price: row.service?.total_cost_price,
        created_at: row.service?.created_at,
        last_updated: row.service?.last_updated,
        deleted_at: row.service?.deleted_at,
      },
      reports_title: row.reports?.reports_title,
      tickets: row.reports?.tickets,
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
      .leftJoin(service, eq(service.service_id, reports.service_id))
      .where(eq(reports.reports_id, Number(reports_id)));
    const reportsWithDetails = result.map((row) => ({
      reports: {
        reports_id: row.reports.reports_id,
        service: {
          service_id: row.service?.service_id,
          service_type_id: row.service?.service_type_id,
          uuid: row.service?.uuid,
          description: row.service?.description,
          fee: row.service?.fee,
          service_status: row.service?.service_status,
          total_cost_price: row.service?.total_cost_price,
          created_at: row.service?.created_at,
          last_updated: row.service?.last_updated,
          deleted_at: row.service?.deleted_at,
        },
      },
      reports_title: row.reports?.reports_title,
      tickets: row.reports?.tickets,
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

import { jobOrder, remarktickets, service } from '@/drizzle/drizzle.schema';
import { and, eq, isNull, sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateRemarkTickets } from './remarkticket.model';

export class RemarkTicketsService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createRemarkTickets(data: CreateRemarkTickets) {
    await this.db.insert(remarktickets).values(data);
  }

  async getAllRemarkTickets(
    remark_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(remarktickets.deleted_at)];

    if (remark_id) {
      conditions.push(eq(remarktickets.remark_id, Number(remark_id)));
    }
    const totalCountQuery = await this.db
      .select({ count: sql<number>`COUNT(*)` })
      .from(remarktickets)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(remarktickets)
      .leftJoin(jobOrder, eq(remarktickets.job_order_id, jobOrder.job_order_id))
      .leftJoin(service, eq(jobOrder.service_id, service.service_id))
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);

    const RemarkTicketsDetails = result.map((row) => ({
      remark_id: row.remarktickets.remark_id,
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
      remark_type: row.remarktickets.remark_type,
      created_by: row.remarktickets.created_by,
      created_at: row.remarktickets.created_at,
      last_updated: row.remarktickets.last_updated,
      deleted_at: row.remarktickets.deleted_at,
    }));

    return { totalData, RemarkTicketsDetails };
  }

  async getRemarkTicketsByID(remark_id: string) {
    const result = await this.db
      .select()
      .from(remarktickets)
      .leftJoin(jobOrder, eq(remarktickets.job_order_id, jobOrder.job_order_id))
      .leftJoin(service, eq(jobOrder.service_id, service.service_id))
      .where(eq(remarktickets.remark_id, Number(remark_id)));

    const RemarkTicketsDetails = result.map((row) => ({
      remark_id: row.remarktickets.remark_id,
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
      remark_type: row.remarktickets.remark_type,
      created_by: row.remarktickets.created_by,
      created_at: row.remarktickets.created_at,
      last_updated: row.remarktickets.last_updated,
      deleted_at: row.remarktickets.deleted_at,
    }));
    return RemarkTicketsDetails;
  }

  async updateRemarkTickets(data: object, paramsId: number) {
    await this.db
      .update(remarktickets)
      .set(data)
      .where(eq(remarktickets.remark_id, paramsId));
  }

  async deleteRemarkTickets(paramsId: number): Promise<void> {
    await this.db
      .update(remarktickets)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(remarktickets.remark_id, paramsId));
  }
}

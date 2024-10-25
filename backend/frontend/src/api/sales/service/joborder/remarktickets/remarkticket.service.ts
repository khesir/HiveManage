import { jobOrder, remarktickets, SchemaType } from '@/drizzle/drizzle.schema';
import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateRemarkTickets } from './remarkticket.model';
import z from 'zod/lib';

export class RemarkTicketsService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createRemarkTickets(data: z.infer<typeof CreateRemarkTickets>) {
    await this.db.insert(remarktickets).values(data);
  }

  async getAllRemarkTickets(
    remark_type: string | undefined,
    remarktickets_status: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(remarktickets.deleted_at)];

    if (remark_type) {
      // Define valid statuses as a string union type
      const validStatuses = [
        'General',
        'Urgent',
        'Follow-up', // Updated to match the seed data
        'Resolved',
        'On-Hold',
        'Information',
      ] as const; // 'as const' infers a readonly tuple of strings
      if (
        validStatuses.includes(remark_type as (typeof validStatuses)[number])
      ) {
        conditions.push(
          eq(
            remarktickets.remark_type,
            remark_type as (typeof validStatuses)[number],
          ),
        );
      } else {
        throw new Error(`Invalid payment status: ${remark_type}`);
      }
    }

    if (remarktickets_status) {
      // Define valid statuses as a string union type
      const validStatuses = [
        'Open',
        'In Progress',
        'Resolved',
        'Closed',
        'Pending',
        'Rejected',
      ] as const; // 'as const' infers a readonly tuple of strings
      if (
        validStatuses.includes(
          remarktickets_status as (typeof validStatuses)[number],
        )
      ) {
        conditions.push(
          eq(
            remarktickets.remarktickets_status,
            remarktickets_status as (typeof validStatuses)[number],
          ),
        );
      } else {
        throw new Error(`Invalid payment status: ${remarktickets_status}`);
      }
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
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(remarktickets.created_at)
          : desc(remarktickets.created_at),
      )
      .limit(limit)
      .offset(offset);

    const RemarkTicketsDetails = result.map((row) => ({
      remark_id: row.remarktickets.remark_id,
      jobOrder: {
        job_order_id: row.joborder?.job_order_id,
        joborder_type_id: row.joborder?.joborder_type_id,
        service_id: row.joborder?.service_id,
        uuid: row.joborder?.uuid,
        fee: row.joborder?.fee,
        status: row.joborder?.status,
        created_at: row.joborder?.created_at,
        last_updated: row.joborder?.last_updated,
        deleted_at: row.joborder?.deleted_at,
      },
      created_by: row.remarktickets.created_by,
      remark_type: row.remarktickets.remark_type,
      description: row.remarktickets.description,
      remarktickets_status: row.remarktickets.remarktickets_status,
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
      .where(eq(remarktickets.remark_id, Number(remark_id)));

    const RemarkTicketsDetails = result.map((row) => ({
      remark_id: row.remarktickets.remark_id,
      jobOrder: {
        job_order_id: row.joborder?.job_order_id,
        joborder_type_id: row.joborder?.joborder_type_id,
        service_id: row.joborder?.service_id,
        uuid: row.joborder?.uuid,
        fee: row.joborder?.fee,
        status: row.joborder?.status,
        created_at: row.joborder?.created_at,
        last_updated: row.joborder?.last_updated,
        deleted_at: row.joborder?.deleted_at,
      },
      created_by: row.remarktickets.created_by,
      remark_type: row.remarktickets.remark_type,
      description: row.remarktickets.description,
      remarktickets_status: row.remarktickets.remarktickets_status,
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

import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateRemarkTickets } from './remarkticket.model';
import { jobOrder, remarkTickets, remarkType } from '@/drizzle/schema/services';
import { SchemaType } from '@/drizzle/schema/type';

export class RemarkTicketsService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createRemarkTickets(data: CreateRemarkTickets) {
    await this.db.insert(remarkTickets).values(data);
  }

  async getAllRemarkTickets(
    no_pagination: boolean,
    joborder_id: string | undefined,
    remarktickets_status: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(remarkTickets.deleted_at)];

    if (remarktickets_status) {
      // Define valid statuses as a string union type
      const validStatuses = ['Removed', 'Resolved', 'Pending'] as const; // 'as const' infers a readonly tuple of strings
      if (
        validStatuses.includes(
          remarktickets_status as (typeof validStatuses)[number],
        )
      ) {
        conditions.push(
          eq(
            remarkTickets.remarktickets_status,
            remarktickets_status as (typeof validStatuses)[number],
          ),
        );
      } else {
        throw new Error(`Invalid payment status: ${remarktickets_status}`);
      }
    }
    if (joborder_id) {
      conditions.push(eq(remarkTickets.job_order_id, Number(joborder_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(remarkTickets)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(remarkTickets)
      .leftJoin(
        remarkType,
        eq(remarkType.remark_type_id, remarkTickets.remark_type_id),
      )
      .leftJoin(jobOrder, eq(jobOrder.job_order_id, remarkTickets.job_order_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(remarkTickets.created_at)
          : desc(remarkTickets.created_at),
      );

    // Control Pagination
    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const remarkticketitemWithDetails = result.map((row) => ({
      remark_id: row.remark_tickets.remark_id,
      remark_type: {
        remark_type_id: row.remark_type?.remark_type_id,
        name: row.remark_type?.name,
        description: row.remark_type?.description,
        created_at: row.remark_type?.created_at,
        last_updated: row.remark_type?.last_updated,
        deleted_at: row.remark_type?.deleted_at,
      },
      job_order: {
        job_order_id: row.job_order?.job_order_id,
        customer_id: row.job_order?.customer_id,
        uuid: row.job_order?.uuid,
        fee: row.job_order?.fee,
        joborder_status: row.job_order?.joborder_status,
        total_cost_price: row.job_order?.total_cost_price,
        created_at: row.job_order?.created_at,
        last_updated: row.job_order?.last_updated,
        deleted_at: row.job_order?.deleted_at,
      },
      title: row.remark_tickets.title,
      description: row.remark_tickets?.description,
      content: row.remark_tickets?.content,
      remarkticket_status: row.remark_tickets?.remarktickets_status,
      deadline: row.remark_tickets?.deadline,
      created_at: row.remark_tickets?.created_at,
      last_updated: row.remark_tickets?.last_updated,
      deleted_at: row.remark_tickets?.deleted_at,
    }));

    return { totalData, remarkticketitemWithDetails };
  }

  async getRemarkTicketsByID(remark_id: string) {
    const result = await this.db
      .select()
      .from(remarkTickets)
      .leftJoin(
        remarkType,
        eq(remarkType.remark_type_id, remarkTickets.remark_type_id),
      )
      .leftJoin(jobOrder, eq(jobOrder.job_order_id, remarkTickets.job_order_id))
      .where(eq(remarkTickets.remark_id, Number(remark_id)));

    const remarkticketitemWithDetails = result.map((row) => ({
      remark_id: row.remark_tickets.remark_id,
      remarktype: {
        remark_type_id: row.remark_type?.remark_type_id,
        name: row.remark_type?.name,
        description: row.remark_type?.description,
        created_at: row.remark_type?.created_at,
        last_updated: row.remark_type?.last_updated,
        deleted_at: row.remark_type?.deleted_at,
      },
      jobOrder: {
        job_order_id: row.job_order?.job_order_id,
        customer_id: row.job_order?.customer_id,
        uuid: row.job_order?.uuid,
        fee: row.job_order?.fee,
        joborder_status: row.job_order?.joborder_status,
        total_cost_price: row.job_order?.total_cost_price,
        created_at: row.job_order?.created_at,
        last_updated: row.job_order?.last_updated,
        deleted_at: row.job_order?.deleted_at,
      },
      description: row.remark_tickets?.description,
      content: row.remark_tickets?.content,
      remarkticket_status: row.remark_tickets?.remarktickets_status,
      deadline: row.remark_tickets?.deadline,
      created_at: row.remark_tickets?.created_at,
      last_updated: row.remark_tickets?.last_updated,
      deleted_at: row.remark_tickets?.deleted_at,
    }));

    return remarkticketitemWithDetails;
  }

  async updateRemarkTickets(data: object, paramsId: number) {
    await this.db
      .update(remarkTickets)
      .set(data)
      .where(eq(remarkTickets.remark_id, paramsId));
  }

  async deleteRemarkTickets(paramsId: number): Promise<void> {
    await this.db
      .update(remarkTickets)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(remarkTickets.remark_id, paramsId));
  }
}

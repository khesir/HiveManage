import {
  employee,
  jobOrder,
  remarkassigned,
  remarktickets,
  remarktype,
  SchemaType,
} from '@/drizzle/drizzle.schema';
import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateRemarkTickets } from './remarkticket.model';

export class RemarkTicketsService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createRemarkTickets(data: CreateRemarkTickets) {
    await this.db.insert(remarktickets).values(data);
  }

  async getAllRemarkTickets(
    no_pagination: boolean,
    joborder_id: string | undefined,
    remarktickets_status: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(remarktickets.deleted_at)];

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
    if (joborder_id) {
      conditions.push(eq(remarktickets.job_order_id, Number(joborder_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(remarktickets)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(remarktickets)
      .leftJoin(
        remarktype,
        eq(remarktype.remark_type_id, remarktickets.remark_type_id),
      )
      .leftJoin(jobOrder, eq(jobOrder.job_order_id, remarktickets.job_order_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(remarktickets.created_at)
          : desc(remarktickets.created_at),
      );

    // Control Pagination
    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    // Handles Other related data
    const remarkAssign = await this.db
      .select()
      .from(remarkassigned)
      .leftJoin(employee, eq(remarkassigned.employee_id, employee.employee_id))
      .where(and(isNull(remarkassigned.deleted_at)));

    const assignmentsByRemarkId = remarkAssign.reduce(
      (acc, assignment) => {
        if (
          assignment.remarkassigned.remark_id !== null &&
          !(assignment.remarkassigned.remark_id in acc)
        ) {
          acc[assignment.remarkassigned.remark_id] = [];
        }
        if (assignment.remarkassigned.remark_id !== null) {
          acc[assignment.remarkassigned.remark_id].push({
            ...assignment.remarkassigned,
            employee: {
              ...assignment.employee,
            },
          });
        }
        return acc;
      },
      // Too much work to write a typing for this
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {} as Record<number, any[]>,
    );
    const remarkticketitemWithDetails = result.map((row) => ({
      remark_id: row.remarktickets.remark_id,
      remark_type: {
        remark_type_id: row.remarktype?.remark_type_id,
        name: row.remarktype?.name,
        description: row.remarktype?.description,
        created_at: row.remarktype?.created_at,
        last_updated: row.remarktype?.last_updated,
        deleted_at: row.remarktype?.deleted_at,
      },
      remark_assign: assignmentsByRemarkId[row.remarktickets.remark_id] || [],
      job_order: {
        job_order_id: row.joborder?.job_order_id,
        joborder_type_id: row.joborder?.joborder_type_id,
        service_id: row.joborder?.service_id,
        uuid: row.joborder?.uuid,
        fee: row.joborder?.fee,
        joborder_status: row.joborder?.joborder_status,
        total_cost_price: row.joborder?.total_cost_price,
        created_at: row.joborder?.created_at,
        last_updated: row.joborder?.last_updated,
        deleted_at: row.joborder?.deleted_at,
      },
      title: row.remarktickets.title,
      description: row.remarktickets?.description,
      content: row.remarktickets?.content,
      remarkticket_status: row.remarktickets?.remarktickets_status,
      created_by: row.remarktickets?.created_by,
      deadline: row.remarktickets?.deadline,
      created_at: row.remarktickets?.created_at,
      last_updated: row.remarktickets?.last_updated,
      deleted_at: row.remarktickets?.deleted_at,
    }));

    return { totalData, remarkticketitemWithDetails };
  }

  async getRemarkTicketsByID(remark_id: string) {
    const result = await this.db
      .select()
      .from(remarktickets)
      .leftJoin(
        remarktype,
        eq(remarktype.remark_type_id, remarktickets.remark_type_id),
      )
      .leftJoin(jobOrder, eq(jobOrder.job_order_id, remarktickets.job_order_id))
      .where(eq(remarktickets.remark_id, Number(remark_id)));

    const remarkticketitemWithDetails = result.map((row) => ({
      remark_id: row.remarktickets.remark_id,
      remarktype: {
        remark_type_id: row.remarktype?.remark_type_id,
        name: row.remarktype?.name,
        description: row.remarktype?.description,
        created_at: row.remarktype?.created_at,
        last_updated: row.remarktype?.last_updated,
        deleted_at: row.remarktype?.deleted_at,
      },
      jobOrder: {
        job_order_id: row.joborder?.job_order_id,
        joborder_type_id: row.joborder?.joborder_type_id,
        service_id: row.joborder?.service_id,
        uuid: row.joborder?.uuid,
        fee: row.joborder?.fee,
        joborder_status: row.joborder?.joborder_status,
        total_cost_price: row.joborder?.total_cost_price,
        created_at: row.joborder?.created_at,
        last_updated: row.joborder?.last_updated,
        deleted_at: row.joborder?.deleted_at,
      },
      description: row.remarktickets?.description,
      content: row.remarktickets?.content,
      remarkticket_status: row.remarktickets?.remarktickets_status,
      created_by: row.remarktickets?.created_by,
      deadline: row.remarktickets?.deadline,
      created_at: row.remarktickets?.created_at,
      last_updated: row.remarktickets?.last_updated,
      deleted_at: row.remarktickets?.deleted_at,
    }));

    return remarkticketitemWithDetails;
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

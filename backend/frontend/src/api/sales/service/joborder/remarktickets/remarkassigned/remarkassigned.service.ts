import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import {
  employee,
  remarkassigned,
  remarktickets,
  SchemaType,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
  CreateRemarkAssigned,
  UpdateRemarkAssigned,
} from './remarkassigned.model';

export class RemarkAssignedService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createRemarkAssigned(data: CreateRemarkAssigned) {
    await this.db.insert(remarkassigned).values(data);
  }

  async getAllRemarkAssigned(
    remark_id: string | undefined,
    employee_id: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(remarkassigned.deleted_at)];

    if (employee_id) {
      conditions.push(eq(remarkassigned.employee_id, Number(employee_id)));
    }

    if (remark_id) {
      conditions.push(eq(remarkassigned.remark_id, Number(remark_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(remarkassigned)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(remarkassigned)
      .leftJoin(
        remarktickets,
        eq(remarktickets.remark_id, remarkassigned.remarkassigned_id),
      )
      .leftJoin(employee, eq(employee.employee_id, remarkassigned.employee_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(remarkassigned.created_at)
          : desc(remarkassigned.created_at),
      )
      .limit(limit)
      .offset(offset);

    const remarkassigneditemWithDetails = result.map((row) => ({
      remarkassigned__id: row.remarkassigned.remarkassigned_id,
      remarktickets: {
        remark_id: row.remarktickets?.remark_id,
        remark_type_id: row.remarktickets?.remark_type_id,
        job_order_id: row.remarktickets?.job_order_id,
        remarktickets_status: row.remarktickets?.remarktickets_status,
        created_by: row.remarktickets?.created_by,
        deadline: row.remarktickets?.deadline,
        created_at: row.remarktickets?.created_at,
        last_updated: row.remarktickets?.last_updated,
        deleted_at: row.remarktickets?.deleted_at,
      },
      employee: {
        employee_id: row.employee?.employee_id,
        firstname: row.employee?.firstname,
        middlename: row.employee?.middlename,
        lastname: row.employee?.lastname,
        email: row.employee?.email,
        profile_link: row.employee?.profile_link,
        created_at: row.employee?.created_at,
        last_updated: row.employee?.last_updated,
        deleted_at: row.employee?.deleted_at,
      },
      created_at: row.remarkassigned?.created_at,
      last_updated: row.remarkassigned?.last_updated,
      deleted_at: row.remarkassigned?.deleted_at,
    }));

    return { totalData, remarkassigneditemWithDetails };
  }

  async getRemarkAssignedById(remarkassigned_id: number) {
    const result = await this.db
      .select()
      .from(remarkassigned)
      .leftJoin(
        remarktickets,
        eq(remarktickets.remark_id, remarkassigned.remarkassigned_id),
      )
      .leftJoin(employee, eq(employee.employee_id, remarkassigned.employee_id))
      .where(eq(remarkassigned.remarkassigned_id, Number(remarkassigned_id)));

    const remarkassigneditemWithDetails = result.map((row) => ({
      remarkassigned__id: row.remarkassigned.remarkassigned_id,
      remarktickets: {
        remark_id: row.remarktickets?.remark_id,
        remark_type_id: row.remarktickets?.remark_type_id,
        job_order_id: row.remarktickets?.job_order_id,
        remarktickets_status: row.remarktickets?.remarktickets_status,
        created_by: row.remarktickets?.created_by,
        deadline: row.remarktickets?.deadline,
        created_at: row.remarktickets?.created_at,
        last_updated: row.remarktickets?.last_updated,
        deleted_at: row.remarktickets?.deleted_at,
      },
      employee: {
        employee_id: row.employee?.employee_id,
        firstname: row.employee?.firstname,
        middlename: row.employee?.middlename,
        lastname: row.employee?.lastname,
        email: row.employee?.email,
        profile_link: row.employee?.profile_link,
        created_at: row.employee?.created_at,
        last_updated: row.employee?.last_updated,
        deleted_at: row.employee?.deleted_at,
      },
      created_at: row.remarkassigned?.created_at,
      last_updated: row.remarkassigned?.last_updated,
      deleted_at: row.remarkassigned?.deleted_at,
    }));

    return remarkassigneditemWithDetails;
  }

  async updateRemarkAssigned(data: UpdateRemarkAssigned, paramsId: number) {
    await this.db
      .update(remarkassigned)
      .set(data)
      .where(eq(remarkassigned.remarkassigned_id, paramsId));
  }

  async deleteRemarkAssigned(paramsId: number): Promise<void> {
    await this.db
      .update(remarkassigned)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(remarkassigned.remarkassigned_id, paramsId));
  }
}

import { asc, desc, eq, isNull, and, sql } from 'drizzle-orm';

import { activityLog, employee } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';

export class ActivityLogService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createActivityLog(data: object) {
    await this.db.insert(activityLog).values(data);
  }

  async getAllActivityLogs(
    employee_id: number | undefined,
    limit: number,
    sort: string,
    offset: number,
  ) {
    const conditions = [isNull(activityLog.deleted_at)];

    if (employee_id) {
      conditions.push(eq(activityLog.employee_id, employee_id));
    }

    const totalCountQuery = await this.db
      .select({ count: sql<number>`COUNT(*)` })
      .from(activityLog)
      .where(and(...conditions));
    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(activityLog)
      .leftJoin(employee, eq(activityLog.employee_id, employee.employee_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(activityLog.created_at)
          : desc(activityLog.created_at),
      )
      .limit(limit)
      .offset(offset);
    const dataWithDetails = result.map((row) => ({
      activity_id: row.activity_log.activity_id,
      employee: {
        employee_id: row.employee?.employee_id,
        firstname: row.employee?.firstname,
        middlename: row.employee?.middlename,
        lastname: row.employee?.lastname,
        status: row.employee?.status,
        created_at: row.employee?.created_at,
        last_updated: row.employee?.last_updated,
        deleted_at: row.employee?.deleted_at,
      },
      action: row.activity_log.action,
      created_at: row.activity_log.created_at,
      deleted_at: row.activity_log.deleted_at,
    }));
    return { totalData, dataWithDetails };
  }

  async getActivityLogById(paramsId: number) {
    const result = await this.db
      .select()
      .from(activityLog)
      .where(eq(activityLog.activity_id, paramsId));
    return result[0];
  }

  async updateActivityLog(data: object, paramsId: number) {
    await this.db
      .update(activityLog)
      .set(data)
      .where(eq(activityLog.activity_id, paramsId));
  }

  async deleteActivityLog(paramsId: number): Promise<void> {
    await this.db
      .update(activityLog)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(activityLog.activity_id, paramsId));
  }
}

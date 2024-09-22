import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { asc, desc, eq, isNull } from 'drizzle-orm';

import { activityLog } from '@/drizzle/drizzle.schema';

export class ActivityLogService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createActivityLog(data: object) {
    await this.db.insert(activityLog).values(data);
  }

  async getAllActivityLogs({ limit = 10, sort = 'asc', page = 1 }) {
    const offset = (page - 1) * limit;
    const result = await this.db
      .select()
      .from(activityLog)
      .where(isNull(activityLog.deleted_at))
      .orderBy(
        sort === 'asc'
          ? asc(activityLog.created_at)
          : desc(activityLog.created_at),
      )
      .limit(limit)
      .offset(offset);
    return result;
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

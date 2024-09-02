import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { activityLog } from '@/drizzle/drizzle.schema';

import { ActivityLog } from './activitylogs.model';
import { eq } from 'drizzle-orm';

export class ActivityLogService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  // Create a new activity log
  async createActivityLog(data: ActivityLog): Promise<void> {
    await this.db.insert(activityLog).values(data);
  }

  // Get all activity logs
  async getAllActivityLogs(): Promise<ActivityLog[]> {
    const result = await this.db.select().from(activityLog);
    return result as ActivityLog[];
  }

  // Get an activity log by ID
  async getActivityLogById(id: number): Promise<ActivityLog | null> {
    const result = await this.db
      .select()
      .from(activityLog)
      .where(eq(activityLog.activity_id, id));
    return result;
  }

  // Update an activity log by ID
  async updateActivityLog(
    id: number,
    data: Partial<ActivityLog>,
  ): Promise<void> {
    await this.db
      .update(activityLog)
      .set(data)
      .where(eq(activityLog.activity_id, id));
  }

  // Delete an activity log by ID
  async deleteActivityLog(activity_id: number): Promise<void> {
    await this.db
      .delete()
      .from(activityLogTable)
      .where(activityLogTable.activity_id.eq(activity_id));
  }
}

import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { eq } from 'drizzle-orm';

import { activityLog } from '../../../../../drizzle/drizzle.schema';

export class ActivityLogService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createActivityLog(data: object) {
    await this.db.insert(activityLog).values(data);
  }

  async getAllActivityLogs() {
    const result = await this.db.select().from(activityLog);
    return result;
  }

  async getActivityLogById(id: number) {
    const result = await this.db
      .select()
      .from(activityLog)
      .where(eq(activityLog.activity_id, id));
    return result[0];
  }

  async updateActivityLog(data: object, id: number) {
    await this.db
      .update(activityLog)
      .set(data)
      .where(eq(activityLog.activity_id, id));
  }
}

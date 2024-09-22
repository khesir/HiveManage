import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { leaveLimit } from '@/drizzle/drizzle.schema';

export class LeaveLimitService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async getAllLeaveLimits(employee_id: number | undefined) {
    if (employee_id) {
      const result = await this.db
        .select()
        .from(leaveLimit)
        .where(eq(leaveLimit.employee_id, employee_id));
      return result;
    } else {
      const result = await this.db.select().from(leaveLimit);
      return result;
    }
  }

  async createLeaveLimit(data: object) {
    await this.db.insert(leaveLimit).values(data);
  }

  async getLeaveLimitById(paramsId: number) {
    const result = await this.db
      .select()
      .from(leaveLimit)
      .where(eq(leaveLimit.leave_limit_id, paramsId));
    return result;
  }

  async updateLeaveLimit(data: object, paramsId: number) {
    await this.db
      .update(leaveLimit)
      .set(data)
      .where(eq(leaveLimit.leave_limit_id, paramsId));
  }

  async deleteLeaveLimit(paramsId: number) {
    await this.db
      .update(leaveLimit)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(leaveLimit.leave_limit_id, paramsId));
  }
}

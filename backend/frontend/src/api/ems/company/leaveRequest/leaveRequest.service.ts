import { eq, isNull, and } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { leaveRequest } from '@/drizzle/drizzle.schema';
import { LeaveRequest } from './leaveRequest.model';

export class LeaveRequestService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async getAllLeaveRequests(employee_id: number | undefined) {
    if (employee_id) {
      const result = await this.db
        .select()
        .from(leaveRequest)
        .where(
          and(
            eq(leaveRequest.employee_id, employee_id),
            isNull(leaveRequest.deleted_at),
          ),
        );
      return result;
    } else {
      const result = await this.db
        .select()
        .from(leaveRequest)
        .where(isNull(leaveRequest.deleted_at));
      return result;
    }
  }

  async createLeaveRequest(data: LeaveRequest) {
    await this.db.insert(leaveRequest).values(data);
  }

  async getLeaveRequestById(paramsId: number) {
    const result = await this.db
      .select()
      .from(leaveRequest)
      .where(
        and(
          eq(leaveRequest.leave_request_id, paramsId),
          isNull(leaveRequest.deleted_at),
        ),
      );
    return result;
  }

  async updateLeaveRequest(data: object, paramsId: number) {
    await this.db
      .update(leaveRequest)
      .set(data)
      .where(eq(leaveRequest.leave_request_id, paramsId));
  }

  async deleteLeaveRequest(paramsId: number) {
    await this.db
      .update(leaveRequest)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(leaveRequest.leave_request_id, paramsId));
  }
}

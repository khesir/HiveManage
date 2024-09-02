import { Pool } from 'mysql2/promise';

interface ActivityLog {
  activity_id?: number;
  employee_id: number;
  action: string;
  created_at?: Date;
  fullname?: string; // To store the employee's full name when retrieving logs
}

export class ActivityLogModel {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  // Create a new activity log
  async createActivityLog(activityLog: ActivityLog): Promise<void> {
    const sql = `
            INSERT INTO ActivityLogs (employee_id, action)
            VALUES (?, ?)
        `;
    await this.db.execute(sql, [activityLog.employee_id, activityLog.action]);
  }

  // Get all activity logs with employee full name
  async getAllActivityLogs() {}

  // Get an activity log by ID with employee full name
  async getActivityLogById(activity_id: number): Promise<ActivityLog | null> {
    const sql = `
            SELECT al.activity_id, al.employee_id, al.action, al.created_at, 
                   CONCAT(e.firstname, ' ', e.middlename, ' ', e.lastname) AS fullname
            FROM ActivityLogs al
            JOIN employee e ON al.employee_id = e.employee_id
            WHERE al.activity_id = ?
        `;
    const [rows] = await this.db.execute(sql, [activity_id]);
    const activityLogs = rows as ActivityLog[];
    return activityLogs.length > 0 ? activityLogs[0] : null;
  }
}

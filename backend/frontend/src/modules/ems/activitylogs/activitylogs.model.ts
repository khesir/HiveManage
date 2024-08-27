import { Pool } from 'mysql2/promise'

interface ActivityLog {
    activity_id?: number;
    employee_id: number;
    action: string;
    created_at?: Date;
    fullname?: string;  // To store the employee's full name when retrieving logs
}

export class ActivityLogModel {
    private db: Pool

    constructor(db: Pool){
        this.db = db
    }

    // Create a new activity log
    async createActivityLog(activityLog: ActivityLog): Promise<number> {
        const sql = `
            INSERT INTO ActivityLogs (employee_id, action)
            VALUES (?, ?)
        `;
        const [result] = await this.db.execute(sql, [activityLog.employee_id, activityLog.action]);
        const insertId = (result as any).insertId; // casting result to any to access insertId
        return insertId;
    }

    // Get all activity logs with employee full name
    async getAllActivityLogs(): Promise<ActivityLog[]> {
        const sql = `
            SELECT al.activity_id, al.employee_id, al.action, al.created_at, 
                   CONCAT(e.firstname, ' ', e.middlename, ' ', e.lastname) AS fullname
            FROM ActivityLogs al
            JOIN employee e ON al.employee_id = e.employee_id
        `;
        const [rows] = await this.db.execute(sql);
        return rows as ActivityLog[];
    }

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
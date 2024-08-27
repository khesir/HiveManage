import { Pool } from 'mysql2/promise';

interface LeaveLimit {
    leave_limit_id?: number;
    employee_id: number;
    limit_count: number;
    leaveType: 'sick_leave' | 'vacation_leave' | 'personal_leave';
}

export class LeaveLimitModel {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    // Create new leave limit
    async createLeaveLimit(limit: LeaveLimit): Promise<number> {
        const sql = `
            INSERT INTO leave_limit (employee_id, limit_count, leaveType)
            VALUES (?, ?, ?)
        `;
        const [result] = await this.db.execute(sql, [
            limit.employee_id, limit.limit_count, limit.leaveType
        ]);
        const insertId = (result as any).insertId; // casting result to any to access insertId
        return insertId;
    }

    // Get leave limit by employee ID
    async getLeaveLimitByEmployeeId(employeeId: number): Promise<LeaveLimit | null> {
        const sql = `
            SELECT * FROM leave_limit WHERE employee_id = ?
        `;
        const [rows] = await this.db.execute(sql, [employeeId]);
        const limit = rows as LeaveLimit[];
        return limit.length > 0 ? limit[0] : null;
    }

    // Update leave limit by ID
    async updateLeaveLimitById(id: number, limit: LeaveLimit): Promise<void> {
        const sql = `
            UPDATE leave_limit SET
                employee_id = ?, limit_count = ?, leaveType = ?
            WHERE leave_limit_id = ?
        `;
        await this.db.execute(sql, [
            limit.employee_id, limit.limit_count, limit.leaveType, id
        ]);
    }

    // Delete leave limit by ID
    async deleteLeaveLimitById(id: number): Promise<void> {
        const sql = `
            DELETE FROM leave_limit WHERE leave_limit_id = ?
        `;
        await this.db.execute(sql, [id]);
    }
}

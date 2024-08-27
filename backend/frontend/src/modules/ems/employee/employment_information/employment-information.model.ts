import { Pool } from "mysql2/promise";

interface EmploymentInformation {
    employment_information_id?: number;
    employee_id: number;
    hireDate?: Date;
    department_id: number;
    designation_id: number;
    employee_type: 'regular' | 'probationary' | 'contractual' | 'seasonal' | 'temporary';
    employee_status: 'active' | 'onLeave' | 'terminated' | 'resigned' | 'suspended' | 'retired' | 'inactive';
    created_at?: Date;
    last_updated?: Date;
}


export class EmploymentInformationModel {
    private db: Pool;
    
    constructor(db:Pool){
        this.db = db
    }
    // Create new employment information
    async createEmploymentInformation(info: EmploymentInformation): Promise<number> {
        const sql = `
            INSERT INTO employment_information (
                employee_id, department_id, designation_id, 
                employee_type, employee_status
            ) VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await this.db.execute(sql, [
            info.employee_id, info.department_id, 
            info.designation_id, info.employee_type, info.employee_status
        ]);
        const insertId = (result as any).insertId; // casting result to any to access insertId
        return insertId;
    }
    
    // Get employment information by employee ID
    async getEmploymentInformationByEmployeeId(employeeId: number): Promise<EmploymentInformation | null> {
        const sql = `
            SELECT * FROM employment_information WHERE employee_id = ?
        `;
        const [rows] = await this.db.execute(sql, [employeeId]);
        const employmentInfo = rows as EmploymentInformation[];
        return employmentInfo.length > 0 ? employmentInfo[0] : null;
    }

    // Update employment information by ID
    async updateEmploymentInformationById(id: number, info: EmploymentInformation): Promise<void> {
        const sql = `
            UPDATE employment_information SET
                employee_id = ?, department_id = ?, designation_id = ?, 
                employee_type = ?, employee_status = ?
            WHERE employment_information_id = ?
        `;
        await this.db.execute(sql, [
            info.employee_id, info.department_id, 
            info.designation_id, info.employee_type, info.employee_status, id
        ]);
    }

    // Delete employment information by ID
    async deleteEmploymentInformationById(id: number): Promise<void> {
        const sql = `
            DELETE FROM employment_information WHERE employment_information_id = ?
        `;
        await this.db.execute(sql, [id]);
    }

}
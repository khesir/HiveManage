import { Pool } from 'mysql2/promise';

interface SalaryInformation {
    salary_information_id?: number;
    employee_id: number;
    payroll_frequency: 'daily' | 'weekly' | 'biWeekly' | 'semiMonthly' | 'monthly';
    base_salary: number;
    created_at?: Date;
    last_updated?: Date;
}

export class SalaryInformationModel {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    // Create new salary information
    async createSalaryInformation(info: SalaryInformation): Promise<number> {
        const sql = `
            INSERT INTO salary_information (
                employee_id, payroll_frequency, base_salary
            ) VALUES (?, ?, ?)
        `;
        const [result] = await this.db.execute(sql, [
            info.employee_id, info.payroll_frequency, info.base_salary
        ]);
        const insertId = (result as any).insertId; // casting result to any to access insertId
        return insertId;
    }

    // Get salary information by employee ID
    async getSalaryInformationByEmployeeId(employeeId: number): Promise<SalaryInformation | null> {
        const sql = `
            SELECT * FROM salary_information WHERE employee_id = ?
        `;
        const [rows] = await this.db.execute(sql, [employeeId]);
        const salaryInfo = rows as SalaryInformation[];
        return salaryInfo.length > 0 ? salaryInfo[0] : null;
    }

    // Update salary information by ID
    async updateSalaryInformationById(id: number, info: SalaryInformation): Promise<void> {
        const sql = `
            UPDATE salary_information SET
                employee_id = ?, payroll_frequency = ?, base_salary = ?
            WHERE salary_information_id = ?
        `;
        await this.db.execute(sql, [
            info.employee_id, info.payroll_frequency, info.base_salary, id
        ]);
    }

    // Delete salary information by ID
    async deleteSalaryInformationById(id: number): Promise<void> {
        const sql = `
            DELETE FROM salary_information WHERE salary_information_id = ?
        `;
        await this.db.execute(sql, [id]);
    }
}

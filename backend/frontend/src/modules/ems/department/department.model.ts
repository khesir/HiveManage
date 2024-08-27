import { Pool } from 'mysql2/promise';

interface Department {
    department_id?: number;
    name: string;
    status: string;
    created_at?: Date;
    last_updated?: Date;
}

export class DepartmentModel {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    // Create a new department
    async createDepartment(department: Department): Promise<number> {
        const sql = `
            INSERT INTO department (name, status)
            VALUES (?, ?)
        `;
        const [result] = await this.db.execute(sql, [department.name, department.status]);
        const insertId = (result as any).insertId; 
        return insertId;
    }

    // Get all departments
    async getAllDepartments(): Promise<Department[]> {
        const sql = `SELECT * FROM department`;
        const [rows] = await this.db.execute(sql);
        return rows as Department[];
    }

    // Get a department by ID
    async getDepartmentById(department_id: number): Promise<Department | null> {
        const sql = `SELECT * FROM department WHERE department_id = ?`;
        const [rows] = await this.db.execute(sql, [department_id]);
        const departments = rows as Department[];
        return departments.length > 0 ? departments[0] : null;
    }

    // Update a department by ID
    async updateDepartment(department_id: number, department: Department): Promise<boolean> {
        const sql = `
            UPDATE department
            SET name = ?, status = ?, last_updated = CURRENT_TIMESTAMP
            WHERE department_id = ?
        `;
        const [result] = await this.db.execute(sql, [department.name, department.status, department_id]);
        const affectedRows = (result as any).affectedRows;
        return affectedRows > 0;
    }

    // Delete a department by ID
    async deleteDepartment(department_id: number): Promise<boolean> {
        const sql = `DELETE FROM department WHERE department_id = ?`;
        const [result] = await this.db.execute(sql, [department_id]);
        const affectedRows = (result as any).affectedRows;
        return affectedRows > 0;
    }
}

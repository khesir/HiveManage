
import { Pool } from 'mysql2/promise'; // Assuming you're using mysql2 with promises

// Define the structure of the Employee
interface Employee {
    employee_id?: number;
    uuid: string;
    firstname: string;
    middlename?: string;
    lastname: string;
    status: string;
    created_at?: Date;
    last_updated?: Date;
}

export class EmployeeModel {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    async create(employee: Employee): Promise<void> {
        const sql = `
            INSERT INTO employee (uuid, firstname, middlename, lastname, status)
            VALUES (?, ?, ?, ?, ?)
        `;
        await this.db.execute(sql, [employee.uuid, employee.firstname, employee.middlename, employee.lastname, employee.status]);
    }

    async findAll(): Promise<Employee[]> {
        const sql = `SELECT * FROM employee`;
        const [rows] = await this.db.execute(sql);
        return rows as Employee[];
    }

    async findById(id: number): Promise<Employee | null> {
        const sql = `SELECT * FROM employee WHERE employee_id = ?`;
        const [rows] = await this.db.execute(sql, [id]);
        const employees = rows as Employee[];
        return employees.length > 0 ? employees[0] : null;
    }

    async updateById(id: number, employee: Partial<Employee>): Promise<void> {
        const sql = `
            UPDATE employee
            SET uuid = ?, firstname = ?, middlename = ?, lastname = ?, status = ?
            WHERE employee_id = ?
        `;
        await this.db.execute(sql, [employee.uuid, employee.firstname, employee.middlename, employee.lastname, employee.status, id]);
    }

    async deleteById(id: number): Promise<void> {
        const sql = `DELETE FROM employee WHERE employee_id = ?`;
        await this.db.execute(sql, [id]);
    }
}
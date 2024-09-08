import { eq, isNull, and } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { employee } from '../../../../../drizzle/drizzle.schema';

export class EmployeeService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async getAllEmployee(status: string | undefined) {
    if (status) {
      const result = await this.db
        .select()
        .from(employee)
        .where(
          and(
            eq(employee.status, status),
            isNull(employee.deleted_at)
          )
        );
      return result;
    } else {
      const result = await this.db.select().from(employee).where(isNull(employee.deleted_at));
      return result;
    }
  }

  async createEmployee(data: object): Promise<void> {
    await this.db.insert(employee).values(data);
  }

  async getEmployeeById(paramsId: number) {
    const result = await this.db
      .select()
      .from(employee)
      .where(eq(employee.employee_id, paramsId));
    return result;
  }

  async updateEmployee(data: object, paramsId: number) {
    await this.db
      .update(employee)
      .set(data)
      .where(eq(employee.employee_id, paramsId));
  }

  async deleteEmployeeById(employeeId: number): Promise<void> {
    await this.db
      .update(employee)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(employee.employee_id, employeeId));
  }
}

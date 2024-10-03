import { asc, desc, eq, isNull, and, sql, like, or } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { employee } from '@/drizzle/drizzle.schema';

export class EmployeeService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }
  async getAllEmployee(
    limit: number,
    sort: string,
    offset: number,
    status: string | undefined,
    fullname: string | undefined,
  ) {
    const conditions = [isNull(employee.deleted_at)];

    if (status) {
      conditions.push(eq(employee.status, status));
    }

    if (fullname) {
      const likeFullname = `%${fullname}%`; // Partial match
      const nameConditions = or(
        like(employee.firstname, likeFullname),
        like(employee.middlename, likeFullname),
        like(employee.lastname, likeFullname),
      );
      if (nameConditions) {
        conditions.push(nameConditions);
      }
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(employee)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(employee)
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(employee.created_at) : desc(employee.created_at),
      )
      .limit(limit)
      .offset(offset);

    return {
      totalData,
      result,
    };
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

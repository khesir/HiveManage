import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { SchemaType } from '@/drizzle/schema/type';
import { employee } from '@/drizzle/schema/ems';
import { employeeLog } from '@/drizzle/schema/records/schema/employeeLog';

export class EmployeeLogService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createEmployeeLog(data: object) {
    await this.db.insert(employeeLog).values(data);
  }

  async getAllEmployeeLog(
    employee_id: string | undefined,
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(employeeLog.deleted_at)];

    if (employee_id) {
      conditions.push(eq(employeeLog.employee_id, Number(employee_id)));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(employeeLog)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(employeeLog)
      .leftJoin(employee, eq(employee.employee_id, employeeLog.performed_by))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(employeeLog.created_at)
          : desc(employeeLog.created_at),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const employeelogWithDetails = result.map((row) => ({
      ...row.employeeLog,
      employee: {
        ...row.employee,
      },
    }));

    return { totalData, employeelogWithDetails };
  }
}

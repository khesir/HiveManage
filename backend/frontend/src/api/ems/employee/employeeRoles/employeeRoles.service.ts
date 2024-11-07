import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import {
  employee,
  employee_roles,
  roles,
  SchemaType,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
  CreateEmployeeRoles,
  UpdateEmployeeRoles,
} from './employeeaccount.model';

export class EmployeeRolesService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createEmployeeAccount(data: CreateEmployeeRoles) {
    await this.db.insert(employee_roles).values(data);
  }

  async getAllEmployeeAccount(
    sort: string,
    limit: number,
    offset: number,
    employee_id: string | undefined,
  ) {
    const conditions = [isNull(employee_roles.deleted_at)];

    if (employee_id) {
      conditions.push(eq(employee_roles.employee_id, Number(employee_id)));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(employee_roles)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(employee_roles)
      .leftJoin(employee, eq(employee.employee_id, employee_roles.employee_id))
      .leftJoin(roles, eq(roles.role_id, employee_roles.role_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(employee_roles.created_at)
          : desc(employee_roles.created_at),
      )
      .limit(limit)
      .offset(offset);

    const employeeaccountWithDetails = result.map((row) => ({
      employee_roles_id: row.employee_roles.employee_roles_id,
      employee: {
        employee_id: row.employee?.employee_id,
        firstname: row.employee?.firstname,
        middlename: row.employee?.middlename,
        lastname: row.employee?.lastname,
        status: row.employee?.status,
        created_at: row.employee?.created_at,
        last_updated: row.employee?.last_updated,
        deleted_at: row.employee?.deleted_at,
      },
      role: {
        role_id: row.roles?.role_id,
        name: row.roles?.name,
        created_at: row.roles?.created_at,
        last_updated: row.roles?.last_updated,
        deleted_at: row.roles?.deleted_at,
      },
      created_at: row.employee_roles.created_at,
      last_updated: row.employee_roles.last_updated,
      deleted_at: row.employee_roles.deleted_at,
    }));
    return { totalData, employeeaccountWithDetails };
  }

  async getEmployeeAccountById(employee_roles_id: string) {
    const result = await this.db
      .select()
      .from(employee_roles)
      .leftJoin(employee, eq(employee.employee_id, employee_roles.employee_id))
      .leftJoin(roles, eq(roles.role_id, employee_roles.role_id))
      .where(
        and(
          eq(employee_roles.employee_roles_id, Number(employee_roles_id)),
          isNull(employee_roles.deleted_at),
        ),
      );

    const employeeaccountWithDetails = result.map((row) => ({
      employee_roles_id: row.employee_roles.employee_roles_id,
      employee: {
        employee_id: row.employee?.employee_id,
        firstname: row.employee?.firstname,
        middlename: row.employee?.middlename,
        lastname: row.employee?.lastname,
        status: row.employee?.status,
        created_at: row.employee?.created_at,
        last_updated: row.employee?.last_updated,
        deleted_at: row.employee?.deleted_at,
      },
      role: {
        role_id: row.roles?.role_id,
        name: row.roles?.name,
        created_at: row.roles?.created_at,
        last_updated: row.roles?.last_updated,
        deleted_at: row.roles?.deleted_at,
      },
      created_at: row.employee_roles.created_at,
      last_updated: row.employee_roles.last_updated,
      deleted_at: row.employee_roles.deleted_at,
    }));
    return employeeaccountWithDetails;
  }

  async updateEmployeeAccount(
    data: UpdateEmployeeRoles,
    employee_role_id: string,
  ) {
    await this.db
      .update(employee_roles)
      .set(data)
      .where(eq(employee_roles.employee_roles_id, Number(employee_role_id)));
  }

  async deleteEmployeeAccount(paramsId: number): Promise<void> {
    await this.db
      .update(employee_roles)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(employee_roles.employee_roles_id, paramsId));
  }
}

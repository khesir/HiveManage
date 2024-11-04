import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import {
  employee,
  employee_account,
  employee_role,
  SchemaType,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateEmployeeAccount } from './employeeaccount.model';

export class EmployeeAccountService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createEmployeeAccount(data: CreateEmployeeAccount) {
    await this.db.insert(employee_account).values(data);
  }

  async getAllEmployeeAccount(
    sort: string,
    limit: number,
    offset: number,
    employee_role_id: string | undefined,
  ) {
    const conditions = [isNull(employee_account.deleted_at)];

    if (employee_role_id) {
      conditions.push(
        eq(employee_account.employee_role_id, Number(employee_role_id)),
      );
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(employee_account)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(employee_account)
      .leftJoin(
        employee,
        eq(employee.employee_id, employee_account.employee_id),
      )
      .leftJoin(
        employee_role,
        eq(employee_role.employee_role_id, employee_account.employee_role_id),
      )
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(employee_account.created_at)
          : desc(employee_account.created_at),
      )
      .limit(limit)
      .offset(offset);

    const employeeaccountWithDetails = result.map((row) => ({
      employee_account_id: row.employee_account.employee_account_id,
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
      employee_role: {
        employee_role_id: row.employee_role?.employee_role_id,
        name: row.employee_role?.name,
        access_level: row.employee_role?.access_level,
        created_at: row.employee_role?.created_at,
        last_updated: row.employee_role?.last_updated,
        deleted_at: row.employee_role?.deleted_at,
      },
      email: row.employee_account.email,
      account_name: row.employee_account?.account_name,
      password: row.employee_account?.password,
      salt: row.employee_account.salt,
      created_at: row.employee_account.created_at,
      last_updated: row.employee_account.last_updated,
      deleted_at: row.employee_account.deleted_at,
    }));
    return { totalData, employeeaccountWithDetails };
  }

  async getEmployeeAccountById(employee_account_id: string) {
    const result = await this.db
      .select()
      .from(employee_account)
      .leftJoin(
        employee,
        eq(employee.employee_id, employee_account.employee_id),
      )
      .leftJoin(
        employee_role,
        eq(employee_role.employee_role_id, employee_account.employee_role_id),
      )
      .where(
        eq(employee_account.employee_account_id, Number(employee_account_id)),
      );

    const employeeaccountWithDetails = result.map((row) => ({
      employee_account_id: row.employee_account.employee_account_id,
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
      employee_role: {
        employee_role_id: row.employee_role?.employee_role_id,
        name: row.employee_role?.name,
        access_level: row.employee_role?.access_level,
        created_at: row.employee_role?.created_at,
        last_updated: row.employee_role?.last_updated,
        deleted_at: row.employee_role?.deleted_at,
      },
      email: row.employee_account.email,
      account_name: row.employee_account?.account_name,
      password: row.employee_account?.password,
      salt: row.employee_account.salt,
      created_at: row.employee_account.created_at,
      last_updated: row.employee_account.last_updated,
      deleted_at: row.employee_account.deleted_at,
    }));
    return employeeaccountWithDetails;
  }

  async updateEmployeeAccount(data: object, paramsId: number) {
    await this.db
      .update(employee_account)
      .set(data)
      .where(eq(employee_account.employee_account_id, paramsId));
  }

  async deleteEmployeeAccount(paramsId: number): Promise<void> {
    await this.db
      .update(employee_account)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(employee_account.employee_account_id, paramsId));
  }
}

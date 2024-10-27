import { eq, isNull } from 'drizzle-orm';
import { employee_role, SchemaType } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateEmployeeRole } from './employeerole.model';

export class EmployeeRoleService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createEmployeeRole(data: CreateEmployeeRole) {
    await this.db.insert(employee_role).values(data);
  }

  async getAllEmployeeRole(limit: number, offset: number) {
    const result = await this.db
      .select()
      .from(employee_role)
      .where(isNull(employee_role.deleted_at))
      .limit(limit)
      .offset(offset);
    return result;
  }

  async getEmployeeRoleById(paramsId: number) {
    const result = await this.db
      .select()
      .from(employee_role)
      .where(eq(employee_role.employee_role_id, paramsId));
    return result[0];
  }

  async updateEmployeeRole(data: object, paramsId: number) {
    await this.db
      .update(employee_role)
      .set(data)
      .where(eq(employee_role.employee_role_id, paramsId));
  }

  async deleteEmployeeRole(paramsId: number): Promise<void> {
    await this.db
      .update(employee_role)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(employee_role.employee_role_id, paramsId));
  }
}

import { eq, isNull } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateEmployeeRole } from './roles.model';
import { roles } from '@/drizzle/schema/ems';
import { SchemaType } from '@/drizzle/schema/type';

export class EmployeeRoleService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createEmployeeRole(data: CreateEmployeeRole) {
    await this.db.insert(roles).values(data);
  }

  async getAllEmployeeRole(limit: number, offset: number) {
    const result = await this.db
      .select()
      .from(roles)
      .where(isNull(roles.deleted_at))
      .limit(limit)
      .offset(offset);
    return result;
  }

  async getEmployeeRoleById(paramsId: number) {
    const result = await this.db
      .select()
      .from(roles)
      .where(eq(roles.role_id, paramsId));
    return result[0];
  }

  async updateEmployeeRole(data: object, paramsId: number) {
    await this.db.update(roles).set(data).where(eq(roles.role_id, paramsId));
  }

  async deleteEmployeeRole(paramsId: number): Promise<void> {
    await this.db
      .update(roles)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(roles.role_id, paramsId));
  }
}

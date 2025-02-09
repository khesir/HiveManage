import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { eq, and, isNull } from 'drizzle-orm';
import { department } from '@/drizzle/schema/ems';
import { SchemaType } from '@/drizzle/schema/type';

export class DepartmentService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createDepartment(data: object) {
    await this.db.insert(department).values(data);
  }

  async getAllDepartments(status: string | undefined) {
    if (status) {
      const result = await this.db
        .select()
        .from(department)
        .where(
          and(eq(department.status, status), isNull(department.deleted_at)),
        );
      return result;
    } else {
      const result = await this.db
        .select()
        .from(department)
        .where(isNull(department.deleted_at));
      return result;
    }
  }

  async getDepartmentById(paramsId: number) {
    const result = await this.db
      .select()
      .from(department)
      .where(eq(department.department_id, paramsId));
    return result[0];
  }

  async updateDepartment(data: object, paramsId: number) {
    const result = await this.db
      .update(department)
      .set(data)
      .where(eq(department.department_id, paramsId));
    return result;
  }

  async deleteDepartment(paramsId: number): Promise<void> {
    await this.db
      .update(department)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(department.department_id, paramsId));
  }
}

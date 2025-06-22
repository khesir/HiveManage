import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';

import { eq, and, isNull } from 'drizzle-orm';
import { designation } from '@/drizzle/schema/ems';
import { SchemaType } from '@/drizzle/schema/type';
export class DesignationService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createDesignation(data: object) {
    await this.db.insert(designation).values(data);
  }

  async getAllDesignations(status: string | undefined) {
    if (status) {
      const result = await this.db
        .select()
        .from(designation)
        .where(
          and(eq(designation.status, status), isNull(designation.deleted_at)),
        );
      return result;
    } else {
      const result = await this.db
        .select()
        .from(designation)
        .where(isNull(designation.deleted_at));
      return result;
    }
  }

  async getDesignationById(paramsId: number) {
    const result = await this.db
      .select()
      .from(designation)
      .where(eq(designation.designation_id, paramsId));
    return result;
  }

  async updateDesignation(data: object, paramsId: number) {
    await this.db
      .update(designation)
      .set(data)
      .where(eq(designation.designation_id, paramsId));
  }

  async deleteDesignation(paramsId: number): Promise<void> {
    await this.db
      .update(designation)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(designation.designation_id, paramsId));
  }
}

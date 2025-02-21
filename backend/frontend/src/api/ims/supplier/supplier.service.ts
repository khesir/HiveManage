import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { eq, isNull, and } from 'drizzle-orm';
import { SchemaType } from '@/drizzle/schema/type';
import { supplier } from '@/drizzle/schema/ims';
import { CreateSupplier } from './supplier.model';

export class SupplierService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createSupplier(data: CreateSupplier) {
    await this.db.insert(supplier).values(data);
  }

  async getAllSupplier(profile: string | undefined) {
    if (profile) {
      const result = await this.db
        .select()
        .from(supplier)
        .where(
          and(eq(supplier.profile_link, profile), isNull(supplier.deleted_at)),
        );
      return result;
    } else {
      const result = await this.db
        .select()
        .from(supplier)
        .where(isNull(supplier.deleted_at));
      return result;
    }
  }

  async getSupplierById(paramsId: number) {
    const result = await this.db
      .select()
      .from(supplier)
      .where(eq(supplier.supplier_id, paramsId));
    return result[0];
  }

  async updateSupplier(data: object, paramsId: number) {
    const result = await this.db
      .update(supplier)
      .set(data)
      .where(eq(supplier.supplier_id, paramsId));
    return result;
  }

  async deleteSupplier(paramsId: number): Promise<void> {
    await this.db
      .update(supplier)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(supplier.supplier_id, paramsId));
  }
}

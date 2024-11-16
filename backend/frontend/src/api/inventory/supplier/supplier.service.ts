import { eq, isNull } from 'drizzle-orm';
import { SchemaType, supplier } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class SupplierService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createSupplier(data: object) {
    await this.db.insert(supplier).values(data);
  }

  async getAllSupplier(limit: number, offset: number, no_pagination: boolean) {
    const query = this.db
      .select()
      .from(supplier)
      .where(isNull(supplier.deleted_at));
    if (no_pagination) {
      query.limit(limit).offset(offset);
    }
    const result = await query;
    return result;
  }

  async getSupplierById(paramsId: number) {
    const result = await this.db
      .select()
      .from(supplier)
      .where(eq(supplier.supplier_id, paramsId));
    return result[0];
  }

  async updateSupplier(data: object, paramsId: number) {
    await this.db
      .update(supplier)
      .set(data)
      .where(eq(supplier.supplier_id, paramsId));
  }

  async deleteSupplier(paramsId: number): Promise<void> {
    await this.db
      .update(supplier)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(supplier.supplier_id, paramsId));
  }
}

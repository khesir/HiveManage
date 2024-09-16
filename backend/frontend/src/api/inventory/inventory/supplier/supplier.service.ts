import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { asc, desc, eq, isNull } from 'drizzle-orm';
import { supplier } from '../../../../../drizzle/drizzle.schema';

export class SupplierService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createSupplier(data: object) {
    await this.db.insert(supplier).values(data);
  }

  async getAllSupplier({ limit = 10, sort = 'asc', page = 1 }) {
    const offset = (page - 1) * limit;
    const result = await this.db
      .select()
      .from(supplier)
      .where(isNull(supplier.deleted_at))
      .orderBy(
        sort === 'asc' ? asc(supplier.created_at) : desc(supplier.created_at),
      )
      .limit(limit)
      .offset(offset);
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

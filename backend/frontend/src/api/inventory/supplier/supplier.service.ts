import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { and, eq, isNull } from 'drizzle-orm';
import { supplier } from '@/drizzle/drizzle.schema';

export class SupplierService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createSupplier(data: object) {
    await this.db.insert(supplier).values(data);
  }

  async getAllSupplier(
    supplier_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    try {
      if (supplier_id) {
        // Query by supplierId with limit and offset
        const result = await this.db
          .select()
          .from(supplier)
          .where(
            and(
              eq(supplier.supplier_id, Number(supplier_id)),
              isNull(supplier.deleted_at),
            ),
          )
          .limit(limit)
          .offset(offset);
        return result;
      } else {
        //Query all suppliers with limit and offset
        const result = await this.db
          .select()
          .from(supplier)
          .where(isNull(supplier.deleted_at))
          .limit(limit)
          .offset(offset);
        return result;
      }
    } catch (error) {
      console.error('Error fetching suppliers: ', error);
      throw new Error('Error fetching suppliers');
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

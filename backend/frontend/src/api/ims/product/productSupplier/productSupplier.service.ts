import { SchemaType } from '@/drizzle/schema/type';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateProductSupplier } from './productSupplier.model';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { productSupplier } from '@/drizzle/schema/ims/schema/product/productSupplier.schema';
import { supplier } from '@/drizzle/schema/ims';

export class ProductSupplierService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async getAllProductSupplier(
    product_id: string | undefined,
    sort: string,
    limit: number,
    offset: number,
    no_pagination: boolean,
  ) {
    const conditions = [isNull(productSupplier.deleted_at)];

    if (product_id) {
      conditions.push(eq(productSupplier.product_id, Number(product_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(productSupplier)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(productSupplier)
      .leftJoin(supplier, eq(supplier.supplier_id, productSupplier.supplier_id))
      .where(and(...conditions))
      .orderBy(
        sort == 'asc'
          ? asc(productSupplier.created_at)
          : desc(productSupplier.created_at),
      );
    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }
    const result = await query;
    const productSupplierWithDetails = result.map((row) => ({
      ...row.product_supplier,
      supplier: {
        ...row.supplier,
      },
    }));

    return { totalData, productSupplierWithDetails };
  }

  // async getProductSuppplierByID(product_supplier_id: string) {
  //   return 'This fetches product supplier id';
  // }

  async createProductSupplier(data: CreateProductSupplier) {
    await this.db.insert(productSupplier).values(data);
  }

  // async updateProductSupplier(data: CreateProductSupplier, paramsId: number) {}

  async deleteProductSupplier(paramsId: number) {
    await this.db
      .update(productSupplier)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(productSupplier.product_supplier_id, paramsId));
  }
}

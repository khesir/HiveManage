import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { product, SchemaType, variant } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateProductVariant } from './prodvar.model';

export class ProductVariantService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createProductVariant(data: CreateProductVariant) {
    await this.db.insert(variant).values(data);
  }

  async getAllProductVariant(sort: string, limit: number, offset: number) {
    const conditions = [isNull(variant.deleted_at)];

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(variant)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(variant)
      .leftJoin(product, eq(variant.product_id, variant.variant_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(variant.created_at) : desc(variant.created_at),
      )
      .limit(limit)
      .offset(offset);

    const productvariantWithDetails = result.map((row) => ({
      ...row.variant,
      product: {
        ...row.product,
      },
    }));

    return { totalData, productvariantWithDetails };
  }

  async getProductVariantById(variant_id: number) {
    const result = await this.db
      .select()
      .from(variant)
      .leftJoin(product, eq(variant.product_id, variant.variant_id))
      .where(eq(variant.variant_id, Number(variant_id)));

    const productvariantWithDetails = result.map((row) => ({
      ...row.variant,
      product: {
        ...row.product,
      },
    }));

    return productvariantWithDetails;
  }

  async updateProductVariant(data: object, paramsId: number) {
    await this.db
      .update(variant)
      .set(data)
      .where(eq(variant.variant_id, paramsId));
  }

  async deleteProductVariant(paramsId: number): Promise<void> {
    await this.db
      .update(variant)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(variant.variant_id, paramsId));
  }
}

import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import {
  prdvariantsupp,
  product,
  SchemaType,
  supplier,
  variant,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateProductVariantSupplier } from './prodvarsupp.model';

export class ProductVarSupplierService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createProductVarSupplier(data: CreateProductVariantSupplier) {
    await this.db.insert(prdvariantsupp).values(data);
  }

  async getAllProductVarSupplier(
    sort: string,
    limit: number,
    offset: number,
    product_id: number | undefined,
  ) {
    const conditions = [isNull(prdvariantsupp.deleted_at)];
    if (product_id) {
      conditions.push(eq(product.product_id, product_id));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(prdvariantsupp)
      .leftJoin(variant, eq(prdvariantsupp.variant_id, variant.variant_id))
      .leftJoin(product, eq(product.product_id, variant.product_id))
      .leftJoin(supplier, eq(prdvariantsupp.supplier_id, supplier.supplier_id))
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(prdvariantsupp)
      .leftJoin(variant, eq(prdvariantsupp.variant_id, variant.variant_id))
      .leftJoin(product, eq(product.product_id, variant.product_id))
      .leftJoin(supplier, eq(prdvariantsupp.supplier_id, supplier.supplier_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(prdvariantsupp.created_at)
          : desc(prdvariantsupp.created_at),
      )
      .limit(limit)
      .offset(offset);

    const productvariantSupplierWithDetails = result.map((row) => ({
      ...row.prdvariantsupp,
      variant: {
        ...row.variant,
      },
      supplier: {
        ...row.supplier,
      },
    }));
    console.log(productvariantSupplierWithDetails);
    return { totalData, productvariantSupplierWithDetails };
  }

  async getProductVarSupplierById(prdvariantsupp_id: number) {
    const result = await this.db
      .select()
      .from(prdvariantsupp)
      .leftJoin(
        variant,
        eq(prdvariantsupp.variant_id, prdvariantsupp.prdvariantsupp_id),
      )
      .leftJoin(supplier, eq(prdvariantsupp.supplier_id, supplier.supplier_id))
      .where(eq(prdvariantsupp.prdvariantsupp_id, Number(prdvariantsupp_id)));

    const productvariantSupplierWithDetails = result.map((row) => ({
      ...row.prdvariantsupp,
      variant: {
        ...row.variant,
      },
      supplier: {
        ...row.supplier,
      },
    }));

    return productvariantSupplierWithDetails;
  }

  async updateProductVarSupplier(data: object, paramsId: number) {
    await this.db
      .update(prdvariantsupp)
      .set(data)
      .where(eq(prdvariantsupp.prdvariantsupp_id, paramsId));
  }

  async deleteProductVarSupplier(paramsId: number): Promise<void> {
    await this.db
      .update(prdvariantsupp)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(prdvariantsupp.prdvariantsupp_id, paramsId));
  }
}

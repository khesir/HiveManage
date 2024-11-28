import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import {
  prdvariantsupp,
  SchemaType,
  supplier,
  variant,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateProductVariantSupplier } from './prodvarsupp.model';
import { CreateProductVariant } from '../prodvar/prodvar.model';

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

    const productVariantsData = await this.db.select().from(variant);
    const variantByproductID = productVariantsData.reduce<
      Record<number, unknown[]>
    >((acc, variant) => {
      const productID = variant.product_id;
      if (productID !== null && !(productID in acc)) {
        acc[productID] = [];
      }
      if (productID !== null) {
        acc[productID].push({
          ...variant,
        });
      }
      return acc;
    }, {});
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(prdvariantsupp)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(prdvariantsupp)
      .leftJoin(variant, eq(prdvariantsupp.variant_id, variant.variant_id))
      .leftJoin(supplier, eq(prdvariantsupp.supplier_id, supplier.supplier_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(prdvariantsupp.created_at)
          : desc(prdvariantsupp.created_at),
      )
      .limit(limit)
      .offset(offset);

    const productvariantSupplierWithDetails = result
      .filter((row) => {
        const productID = row.variant?.product_id;
        const variantItems: CreateProductVariant[] =
          productID !== null && productID !== undefined
            ? (variantByproductID[productID] as CreateProductVariant[]) || []
            : [];
        if (product_id) {
          return variantItems.some((item) => item.product_id === product_id);
        }

        return true;
      })
      .map((row) => ({
        ...row.prdvariantsupp,
        variant: {
          ...row.variant,
        },
        supplier: {
          ...row.supplier,
        },
      }));

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

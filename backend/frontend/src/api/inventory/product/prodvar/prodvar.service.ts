import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import {
  product,
  SchemaType,
  variant,
  prdvariantsupp,
  supplier,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateProductVariant } from './prodvar.model';
import { SupabaseService } from '@/supabase/supabase.service';

export class ProductVariantService {
  private db: PostgresJsDatabase<SchemaType>;
  private supabaseSerivce: SupabaseService;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
    this.supabaseSerivce = SupabaseService.getInstance();
  }

  async createProductVariant(
    data: CreateProductVariant,
    file: Express.Multer.File | undefined,
  ) {
    await this.db.transaction(async (tx) => {
      let filePath = undefined;
      if (file) {
        filePath = await this.supabaseSerivce.uploadImageToBucket(file);
      }
      const [newVariant] = await tx
        .insert(variant)
        .values({
          product_id: data.product_id,
          variant_name: data.variant_name,
          img_url: filePath,
          attribute: data.attribute,
        })
        .returning({ variant_id: variant.variant_id });
      const prdVariantSuppData = data.suppliers.map((value) => ({
        variant_id: newVariant.variant_id,
        supplier_id: value,
      }));
      await tx.insert(prdvariantsupp).values(prdVariantSuppData);
    });
  }

  async getAllProductVariant(
    sort: string,
    limit: number,
    offset: number,
    product_id: number | undefined,
    no_pagination: boolean,
    supplier_id: number | undefined,
  ) {
    const conditions = [isNull(variant.deleted_at)];
    if (product_id) {
      conditions.push(eq(variant.product_id, product_id));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(variant)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;
    const prdVariantSuppData = await this.db
      .select()
      .from(prdvariantsupp)
      .leftJoin(supplier, eq(supplier.supplier_id, prdvariantsupp.supplier_id));

    const varaintByVariantId = prdVariantSuppData.reduce<
      Record<number, unknown[]>
    >((acc, product_variant) => {
      const variantID = product_variant.prdvariantsupp.variant_id;
      if (variantID !== null && !(variantID in acc)) {
        acc[variantID] = [];
      }
      if (variantID !== null) {
        acc[variantID].push({
          ...product_variant.prdvariantsupp,
          supplier: {
            ...product_variant.supplier,
          },
        });
      }
      return acc;
    }, {});

    const query = this.db
      .select()
      .from(variant)
      .leftJoin(product, eq(variant.product_id, product.product_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(variant.created_at) : desc(variant.created_at),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }
    const result = await query;
    const productvariantWithDetails = result
      .filter((row) => {
        const variantID = row.variant?.variant_id;
        const productVariants =
          variantID !== undefined ? varaintByVariantId[variantID] || [] : [];
        if (supplier_id) {
          return productVariants.some(
            (variant: unknown) =>
              (variant as { supplier_id: number }).supplier_id === supplier_id,
          );
        }
        return true;
      })
      .map((row) => ({
        ...row.variant,
        product: {
          ...row.product,
        },
        prdvariantsupp: varaintByVariantId[row.variant.variant_id] || [],
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

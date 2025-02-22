import { and, eq, isNull, asc, desc, sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import {
  category,
  discount,
  discountProducts,
  product,
} from '@/drizzle/schema/ims';

export class DiscountItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createDiscountItem(data: object) {
    await this.db.insert(discountProducts).values(data);
  }

  async getAllDiscountItem(sort: string, limit: number, offset: number) {
    const conditions = [isNull(discountProducts.deleted_at)];

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(discountProducts)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(discountProducts)
      .leftJoin(product, eq(product.product_id, discountProducts.product_id))
      .leftJoin(
        discount,
        eq(discount.discount_id, discountProducts.discount_id),
      )
      .leftJoin(
        category,
        eq(category.category_id, discountProducts.category_id),
      )
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(discountProducts.created_at)
          : desc(discountProducts.created_at),
      )
      .limit(limit)
      .offset(offset);
    const discountitemWithDetails = result.map((row) => ({
      ...row.discount_p,
      product: {
        ...row.product,
        discount: {
          ...row.discount,
        },
        category: {
          ...row.category,
        },
      },
    }));

    return { totalData, discountitemWithDetails };
  }

  async getDiscountItemById(discount_product_id: number) {
    const result = await this.db
      .select()
      .from(discountProducts)
      .leftJoin(product, eq(product.product_id, discountProducts.product_id))
      .leftJoin(
        discount,
        eq(discount.discount_id, discountProducts.discount_id),
      )
      .leftJoin(
        category,
        eq(category.category_id, discountProducts.category_id),
      )
      .where(
        eq(discountProducts.discount_product_id, Number(discount_product_id)),
      );

    const discountitemsWithDetails = result.map((row) => ({
      ...row.discount_p,
      product: {
        ...row.product,
        discount: {
          ...row.discount,
        },
        category: {
          ...row.category,
        },
      },
    }));

    return discountitemsWithDetails;
  }

  async updateDiscountItem(data: object, paramsId: number) {
    await this.db
      .update(discountProducts)
      .set(data)
      .where(eq(discountProducts.discount_product_id, paramsId));
  }

  async deleteDiscountItem(paramsId: number): Promise<void> {
    await this.db
      .update(discountProducts)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(discountProducts.discount_product_id, paramsId));
  }
}

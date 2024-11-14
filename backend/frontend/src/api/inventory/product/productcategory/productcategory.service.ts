import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import {
  category,
  product,
  product_category,
  SchemaType,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateProductCategory } from './productcategory.model';

export class ProductCategoryService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createProductCategory(data: CreateProductCategory) {
    await this.db.insert(product).values(data);
  }

  async getAllProductCategory(sort: string, limit: number, offset: number) {
    const conditions = [isNull(product.deleted_at)];

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(product)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(product_category)
      .leftJoin(
        product,
        eq(product_category.product_id, product_category.product_category_id),
      )
      .leftJoin(
        category,
        eq(product_category.category_id, category.category_id),
      )
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(product_category.created_at)
          : desc(product_category.created_at),
      )
      .limit(limit)
      .offset(offset);

    const productcategoryWithDetails = result.map((row) => ({
      ...row.product_category,
      product: {
        ...row.product,
      },
    }));

    return { totalData, productcategoryWithDetails };
  }

  async getProductCategoryById(product_category_id: number) {
    const result = await this.db
      .select()
      .from(product_category)
      .leftJoin(
        product,
        eq(product_category.product_id, product_category.product_category_id),
      )
      .leftJoin(
        category,
        eq(product_category.category_id, category.category_id),
      )
      .where(
        eq(product_category.product_category_id, Number(product_category_id)),
      );

    const productcategoryWithDetails = result.map((row) => ({
      ...row.product_category,
      product: {
        ...row.product,
      },
    }));

    return productcategoryWithDetails;
  }

  async updateProductCategory(data: object, paramsId: number) {
    await this.db
      .update(product_category)
      .set(data)
      .where(eq(product_category.product_category_id, paramsId));
  }

  async deleteProductCategory(paramsId: number): Promise<void> {
    await this.db
      .update(product_category)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(product_category.product_category_id, paramsId));
  }
}

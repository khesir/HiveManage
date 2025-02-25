import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { isNull, eq, sql, and, asc, desc } from 'drizzle-orm';
import { SchemaType } from '@/drizzle/schema/type';
import { category, productDetails } from '@/drizzle/schema/ims';
import { CreateProductDetails } from './p_det.model';

export class ProductDetailsService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createProductDetails(data: CreateProductDetails) {
    await this.db.insert(productDetails).values(data);
  }

  async getAllProductDetails(
    category_id: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(productDetails.deleted_at)];

    if (category_id) {
      conditions.push(eq(productDetails.category_id, Number(category_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(productDetails)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(productDetails)
      .leftJoin(category, eq(category.category_id, productDetails.category_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(productDetails.created_at)
          : desc(productDetails.created_at),
      )
      .limit(limit)
      .offset(offset);

    const productdetailsWithDetails = result.map((row) => ({
      ...row.product_details,
      category: {
        ...row.category,
      },
    }));
    return { totalData, productdetailsWithDetails };
  }

  async getProductDetailsByID(p_details_id: string) {
    const result = await this.db
      .select()
      .from(productDetails)
      .leftJoin(category, eq(category.category_id, productDetails.category_id))
      .where(eq(productDetails.p_details_id, Number(p_details_id)));

    const productdetailsWithDetails = result.map((row) => ({
      ...row.product_details,
      category: {
        ...row.category,
      },
    }));

    return productdetailsWithDetails;
  }

  async updateProductDetails(data: object, paramsId: number) {
    await this.db
      .update(productDetails)
      .set(data)
      .where(eq(productDetails.p_details_id, paramsId));
  }

  async deleteProductDetails(paramsId: number): Promise<void> {
    await this.db
      .update(productDetails)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(productDetails.p_details_id, paramsId));
  }
}

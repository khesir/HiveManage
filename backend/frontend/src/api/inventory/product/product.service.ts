import { and, eq, isNull } from 'drizzle-orm';
import { product } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateProduct } from './product.model';

export class ProductService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createProduct(data: CreateProduct) {
    // Ensure the data passed matches expected schema and format
    await this.db.insert(product).values({
      ...data,
      price: parseFloat(data.price.toFixed(2)), // Example to handle decimal precision
    });
  }

  async getAllProduct(
    product_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    try {
      if (product_id) {
        // Query by supplierId with limit and offset
        const result = await this.db
          .select()
          .from(product)
          .where(
            and(
              eq(product.product_id, Number(product_id)),
              isNull(product.deleted_at),
            ),
          )
          .limit(limit)
          .offset(offset);
        return result;
      } else {
        //Query all suppliers with limit and offset
        const result = await this.db
          .select()
          .from(product)
          .where(isNull(product.deleted_at))
          .limit(limit)
          .offset(offset);
        return result;
      }
    } catch (error) {
      console.error('Error fetching suppliers: ', error);
      throw new Error('Error fetching suppliers');
    }
  }

  async getProductById(paramsId: number) {
    const result = await this.db
      .select()
      .from(product)
      .where(eq(product.product_id, paramsId));
    return result[0];
  }

  async updateProduct(data: object, paramsId: number) {
    await this.db
      .update(product)
      .set(data)
      .where(eq(product.product_id, paramsId));
  }

  async deleteProduct(paramsId: number): Promise<void> {
    await this.db
      .update(product)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(product.product_id, paramsId));
  }
}

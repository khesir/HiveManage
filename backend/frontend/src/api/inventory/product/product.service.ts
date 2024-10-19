import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { category, product, supplier } from '@/drizzle/drizzle.schema';
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
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(product.deleted_at)];

    if (product_id) {
      conditions.push(eq(product.product_id, Number(product_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(product)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(product)
      .leftJoin(category, eq(product.category_id, product.product_id))
      .leftJoin(supplier, eq(product.supplier_id, supplier.supplier_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(product.created_at) : desc(product.created_at),
      )
      .limit(limit)
      .offset(offset);

    const productWithDetails = result.map((row) => ({
      product_id: row.product.product_id,
      category: {
        category_id: row.category?.category_id,
        name: row.category?.name,
        content: row.category?.content,
        created_at: row.category?.created_at,
        last_updated: row.category?.last_updated,
        deleted_at: row.category?.deleted_at,

        supplier: {
          supplier_id: row.supplier?.supplier_id,
          name: row.supplier?.name,
          contact_number: row.supplier?.contact_number,
          remarks: row.supplier?.remarks,
          created_at: row.supplier?.created_at,
          last_updated: row.supplier?.last_updated,
          deleted_at: row.supplier?.deleted_at,
        },
      },
      name: row.product?.name,
      description: row.product?.description,
      price: row.product?.price,
      img_url: row.product?.img_url,
      created_at: row.product?.created_at,
      last_updated: row.product?.last_updated,
      deleted_at: row.product?.deleted_at,
    }));

    return { totalData, productWithDetails };
  }

  async getProductById(product_id: number) {
    const result = await this.db
      .select()
      .from(product)
      .leftJoin(category, eq(product.category_id, category.category_id))
      .leftJoin(supplier, eq(product.supplier_id, supplier.supplier_id))
      .where(eq(product.product_id, Number(product_id)));

    const productWithDetails = result.map((row) => ({
      product_id: row.product.product_id,
      category: {
        category_id: row.category?.category_id,
        name: row.category?.name,
        content: row.category?.content,
        created_at: row.category?.created_at,
        last_updated: row.category?.last_updated,
        deleted_at: row.category?.deleted_at,

        supplier: {
          supplier_id: row.supplier?.supplier_id,
          name: row.supplier?.name,
          contact_number: row.supplier?.contact_number,
          remarks: row.supplier?.remarks,
          created_at: row.supplier?.created_at,
          last_updated: row.supplier?.last_updated,
          deleted_at: row.supplier?.deleted_at,
        },
      },
      name: row.product?.name,
      description: row.product?.description,
      price: row.product?.price,
      img_url: row.product?.img_url,
      created_at: row.product?.created_at,
      last_updated: row.product?.last_updated,
      deleted_at: row.product?.deleted_at,
    }));

    return productWithDetails;
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

import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import {
  product,
  product_attachment,
  SchemaType,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class ProductAttachmentService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createProductAttachment(data: object) {
    // Ensure the data passed matches expected schema and format
    await this.db.insert(product).values(data);
  }

  async getAllProductAttachment(sort: string, limit: number, offset: number) {
    const conditions = [isNull(product.deleted_at)];

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(product_attachment)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(product_attachment)
      .leftJoin(product, eq(product_attachment.product_id, product.product_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(product_attachment.created_at)
          : desc(product_attachment.created_at),
      )
      .limit(limit)
      .offset(offset);

    const productattachmentWithDetails = result.map((row) => ({
      ...row.product_attachment,
      product: {
        ...row.product,
      },
    }));

    return { totalData, productattachmentWithDetails };
  }

  async getProductAttachmentById(product_id: number) {
    const result = await this.db
      .select()
      .from(product_attachment)
      .leftJoin(product, eq(product_attachment.product_id, product.product_id))
      .where(eq(product.product_id, Number(product_id)));

    const productattachmentWithDetails = result.map((row) => ({
      ...row.product_attachment,
      product: {
        ...row.product,
      },
    }));

    return productattachmentWithDetails;
  }

  async updateProductAttachment(data: object, paramsId: number) {
    await this.db
      .update(product)
      .set(data)
      .where(eq(product.product_id, paramsId));
  }

  async deleteProductAttachment(paramsId: number): Promise<void> {
    await this.db
      .update(product)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(product.product_id, paramsId));
  }
}

import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { product, product_attachment } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class ProductAttachmentService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
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
      product_attachment_id: row.product_attachment.product_attachment_id,

      product: {
        product_id: row.product?.supplier_id,
        category_id: row.product?.name,
        supplier_id: row.product?.name,
        name: row.product?.name,
        img_url: row.product?.img_url,
        description: row.product?.description,
        created_at: row.product?.created_at,
        last_updated: row.product?.last_updated,
        deleted_at: row.product?.deleted_at,
      },
      filepath: row.product_attachment?.filePath,
      created_at: row.product_attachment?.created_at,
      last_updated: row.product_attachment?.last_updated,
      deleted_at: row.product_attachment?.deleted_at,
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
      product_attachment_id: row.product_attachment.product_attachment_id,
      product: {
        product_id: row.product?.supplier_id,
        category_id: row.product?.name,
        supplier_id: row.product?.name,
        name: row.product?.name,
        img_url: row.product?.img_url,
        description: row.product?.description,
        created_at: row.product?.created_at,
        last_updated: row.product?.last_updated,
        deleted_at: row.product?.deleted_at,
      },
      filepath: row.product_attachment?.filePath,
      created_at: row.product_attachment?.created_at,
      last_updated: row.product_attachment?.last_updated,
      deleted_at: row.product_attachment?.deleted_at,
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

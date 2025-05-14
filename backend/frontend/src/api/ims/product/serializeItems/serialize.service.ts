import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { CreateSerialize, UpdateSerialize } from './serialize.model';
import { SchemaType } from '@/drizzle/schema/type';
import { product, serializeProduct, supplier } from '@/drizzle/schema/ims';

export class SerializeItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createSerializeItem(data: CreateSerialize) {
    await this.db
      .insert(serializeProduct)
      .values({ ...data, warranty_date: new Date(Date.now()).toISOString() });
  }

  async getAllSerializedProducts(
    product_id: string | undefined,
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
    status: string | undefined,
  ) {
    const conditions = [isNull(serializeProduct.deleted_at)];

    if (product_id) {
      conditions.push(eq(serializeProduct.product_id, Number(product_id)));
    }
    if (status) {
      conditions.push(eq(serializeProduct.status, 'Available'));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(serializeProduct)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(serializeProduct)
      .leftJoin(product, eq(product.product_id, serializeProduct.product_id))
      .leftJoin(
        supplier,
        eq(supplier.supplier_id, serializeProduct.supplier_id),
      )
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(serializeProduct.serial_id)
          : desc(serializeProduct.serial_id),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;
    const serializedproductsWithDetails = result.map((row) => ({
      ...row.serialized_product,
      product: row.product,
      supplier: row.supplier,
    }));

    return { totalData, serializedproductsWithDetails };
  }

  async getSerializedProductsById(serial_id: number) {
    const result = await this.db
      .select()
      .from(serializeProduct)
      .leftJoin(product, eq(product.product_id, serializeProduct.product_id))
      .where(eq(serializeProduct.serial_id, Number(serial_id)));

    const serializedproductsWithDetails = result.map((row) => ({
      ...row.serialized_product,
      product: {
        ...row.product,
      },
      supplier: {
        row,
      },
    }));
    return serializedproductsWithDetails;
  }

  async updateSerializeItem(data: UpdateSerialize, paramsId: number) {
    await this.db
      .update(serializeProduct)
      .set({ ...data })
      .where(eq(serializeProduct.serial_id, Number(paramsId)));
  }

  async deleteSerializeItem(paramsId: number): Promise<void> {
    await this.db
      .update(serializeProduct)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(serializeProduct.serial_id, paramsId));
  }
}

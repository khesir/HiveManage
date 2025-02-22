import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { CreateSerialize } from './serialize.model';
import { SchemaType } from '@/drizzle/schema/type';
import { product, serializeProducts } from '@/drizzle/schema/ims';

export class SerializeItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createSerializeItem(data: CreateSerialize) {
    const batchData = {
      ...data,
      status: data.status || 'New',
    };
    await this.db.insert(serializeProducts).values(batchData);
  }

  async getAllSerializedProducts(
    product_id: string | undefined,
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(serializeProducts.deleted_at)];

    if (product_id) {
      conditions.push(eq(serializeProducts.product_id, Number(product_id)));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(serializeProducts)
      .leftJoin(product, eq(product.product_id, serializeProducts.product_id))
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(serializeProducts)
      .leftJoin(product, eq(product.product_id, serializeProducts.product_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(serializeProducts.created_at)
          : desc(serializeProducts.created_at),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const serializedproductsWithDetails = result.map((row) => ({
      serialized_item_id: row.serialized_products.serialized_item_id,
      product: {
        product_id: row.product?.product_id,
        supplier_id: row.product?.supplier_id,
        product_details_id: row.product?.p_details_id,
        price: row.product?.price,
        discount: row.product?.discount,
        is_serialize: row.product?.is_serialize,
        created_at: row.product?.created_at,
        last_updated: row.product?.last_updated,
        deleted_at: row.product?.deleted_at,
      },
      serial_number: row.serialized_products?.serial_number,
      status: row.serialized_products?.status,
      created_at: row.serialized_products?.created_at,
      last_updated: row.serialized_products?.last_updated,
      deleted_at: row.serialized_products?.deleted_at,
    }));

    return { totalData, serializedproductsWithDetails };
  }

  async getSerializedProductsById(serialized_item_id: number) {
    const result = await this.db
      .select()
      .from(serializeProducts)
      .leftJoin(product, eq(product.product_id, serializeProducts.product_id))
      .where(
        eq(serializeProducts.serialized_item_id, Number(serialized_item_id)),
      );

    const serializedproductsWithDetails = result.map((row) => ({
      serialized_item_id: row.serialized_products.serialized_item_id,
      product: {
        product_id: row.product?.product_id,
        supplier_id: row.product?.supplier_id,
        product_details_id: row.product?.p_details_id,
        price: row.product?.price,
        discount: row.product?.discount,
        is_serialize: row.product?.is_serialize,
        created_at: row.product?.created_at,
        last_updated: row.product?.last_updated,
        deleted_at: row.product?.deleted_at,
      },
      serial_number: row.serialized_products?.serial_number,
      status: row.serialized_products?.status,
      created_at: row.serialized_products?.created_at,
      last_updated: row.serialized_products?.last_updated,
      deleted_at: row.serialized_products?.deleted_at,
    }));

    return serializedproductsWithDetails;
  }

  async updateSerializeItem(data: object, paramsId: number) {
    await this.db
      .update(serializeProducts)
      .set(data)
      .where(eq(serializeProducts.serialized_item_id, Number(paramsId)));
  }

  async deleteSerializeItem(paramsId: number): Promise<void> {
    await this.db
      .update(serializeProducts)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(serializeProducts.serialized_item_id, paramsId));
  }
}

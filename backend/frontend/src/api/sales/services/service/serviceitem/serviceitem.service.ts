import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { product, productRecord, serializeProduct } from '@/drizzle/schema/ims';
import { SchemaType } from '@/drizzle/schema/type';
import { service, serviceItems } from '@/drizzle/schema/services';
import { CreateServiceItem } from './serviceitem.model';

export class ServiceItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createServiceItem(data: CreateServiceItem) {
    await this.db.insert(serviceItems).values(data);
  }

  async getAllServiceItem(
    product_id: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(serviceItems.deleted_at)];

    if (product_id !== undefined && !isNaN(Number(product_id))) {
      conditions.push(eq(serviceItems.product_id, Number(product_id)));
    }

    const totalCountQuery = await this.db
      .select({ count: sql<number>`COUNT(*)` })
      .from(serviceItems)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(serviceItems)
      .leftJoin(product, eq(product.product_id, serviceItems.product_id))
      .leftJoin(service, eq(service.service_id, serviceItems.serial_id))
      .leftJoin(
        productRecord,
        eq(productRecord.product_record_id, serviceItems.product_record_id),
      )
      .leftJoin(
        serializeProduct,
        eq(serializeProduct.serial_id, serviceItems.serial_id),
      )
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(serviceItems.created_at)
          : desc(serviceItems.created_at),
      )
      .limit(limit)
      .offset(offset);

    const serviceitemWithDetails = result.map((row) => ({
      ...row.serviceItems,
      product: {
        ...row.product,
      },
      service: {
        ...row.service,
      },
      productRecord: {
        ...row.product_record,
      },
      serializedProduct: {
        ...row.serialized_product,
      },
    }));

    return { totalData, serviceitemWithDetails };
  }

  async getServiceItemById(service_items_id: number) {
    const result = await this.db
      .select()
      .from(serviceItems)
      .leftJoin(product, eq(product.product_id, serviceItems.product_id))
      .leftJoin(service, eq(service.service_id, serviceItems.serial_id))
      .leftJoin(
        productRecord,
        eq(productRecord.product_record_id, serviceItems.product_record_id),
      )
      .leftJoin(
        serializeProduct,
        eq(serializeProduct.serial_id, serviceItems.serial_id),
      )
      .where(eq(serviceItems.service_items_id, Number(service_items_id)));

    const serviceitemWithDetails = result.map((row) => ({
      ...row.serviceItems,
      product: {
        ...row.product,
      },
      service: {
        ...row.service,
      },
      productRecord: {
        ...row.product_record,
      },
      serializedProduct: {
        ...row.serialized_product,
      },
    }));

    return serviceitemWithDetails;
  }

  async updateServiceItem(data: object, paramsId: number) {
    await this.db
      .update(serviceItems)
      .set(data)
      .where(eq(serviceItems.service_items_id, paramsId));
  }

  async deleteServiceItem(paramsId: number): Promise<void> {
    await this.db
      .update(serviceItems)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(serviceItems.service_items_id, paramsId));
  }
}

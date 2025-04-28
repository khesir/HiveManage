import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { SchemaType } from '@/drizzle/schema/type';
import { serviceItem } from '@/drizzle/schema/ims/schema/service/serviceItems.schema';
import { CreateServiceItem } from './serviceItem.model';
import { product } from '@/drizzle/schema/ims';
import { service_Type } from '@/drizzle/schema/services';

export class ServiceItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createServiceItem(data: CreateServiceItem) {
    await this.db.insert(serviceItem).values(data);
  }

  async getAllServiceItem(
    product_id: string | undefined,
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(serviceItem.deleted_at)];

    if (product_id) {
      conditions.push(eq(serviceItem.product_id, Number(product_id)));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(serviceItem)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(serviceItem)
      .leftJoin(product, eq(product.product_id, serviceItem.product_id))
      .leftJoin(
        service_Type,
        eq(service_Type.service_type_id, serviceItem.service_type_id),
      )
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(serviceItem.created_at)
          : desc(serviceItem.created_at),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const serviceitemsWithDetails = result.map((row) => ({
      ...row.service_item,
      product: {
        ...row.product,
      },
      service_Type: {
        ...row.service_Type,
      },
    }));

    return { totalData, serviceitemsWithDetails };
  }

  async getServiceItemById(service_item_id: number) {
    const result = await this.db
      .select()
      .from(serviceItem)
      .leftJoin(product, eq(product.product_id, serviceItem.product_id))
      .leftJoin(
        service_Type,
        eq(service_Type.service_type_id, serviceItem.service_type_id),
      )
      .where(eq(serviceItem.service_item_id, Number(service_item_id)));

    const serviceitemsWithDetails = result.map((row) => ({
      ...row.service_item,
      product: {
        ...row.product,
      },
      service_Type: {
        ...row.service_Type,
      },
    }));
    return serviceitemsWithDetails;
  }

  async updateServiceItem(data: object, paramsId: number) {
    await this.db
      .update(serviceItem)
      .set(data)
      .where(eq(serviceItem.service_item_id, Number(paramsId)));
  }

  async deleteServiceItem(paramsId: number): Promise<void> {
    await this.db
      .update(serviceItem)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(serviceItem.service_item_id, paramsId));
  }
}

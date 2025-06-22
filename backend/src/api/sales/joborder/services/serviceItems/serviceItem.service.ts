import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, asc, desc, eq, inArray, isNull, sql } from 'drizzle-orm';
import { SchemaType } from '@/drizzle/schema/type';
import { CreateServiceItem } from './serviceItem.model';
import { product, serializeProduct } from '@/drizzle/schema/ims';
import { serviceItem } from '@/drizzle/schema/services/schema/service/serviceItems';
import { service } from '@/drizzle/schema/services';

export class ServiceItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createServiceItem(data: CreateServiceItem) {
    await this.db.transaction(async (tx) => {
      const { serialize_items, ...insertData } = data;
      const items = serialize_items?.map((item) => item.serial_id!);
      const existingData = await tx
        .select()
        .from(serviceItem)
        .where(
          and(
            eq(serviceItem.product_id, data.product_id),
            eq(serviceItem.service_id, data.service_id),
          ),
        );
      if (existingData.length > 0) {
        const existingItem = existingData[0];
        await tx
          .update(serviceItem)
          .set({
            ...insertData,
            quantity: (existingItem.quantity ?? 0) + (insertData.quantity ?? 0),
            serialize_items: [
              ...(existingItem.serialize_items ?? []),
              ...(items ?? []),
            ],
          })
          .where(eq(serviceItem.service_item_id, existingItem.service_item_id)); // Ensure `where` is applied for update
      } else {
        console.log('Insert payload:', {
          ...insertData,
          serialize_items: items,
        });
        await tx.insert(serviceItem).values({
          ...insertData,
          serialize_items: items,
        });
      }
      console.log('pass');
      if (serialize_items && serialize_items.length > 0) {
        for (const serial of serialize_items) {
          await tx
            .update(serializeProduct)
            .set({ status: 'In Service' })
            .where(eq(serializeProduct.serial_id, serial.serial_id!));
        }
      }
      await tx
        .update(service)
        .set({
          total_cost_price: sql`${service.total_cost_price} + ${(data.sold_price ?? 0) * (data.quantity ?? 0)}`,
        })
        .where(eq(service.service_id, data.service_id));
    });
  }

  async getAllServiceItem(
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
    service_id: number | undefined,
  ) {
    const conditions = [isNull(serviceItem.deleted_at)];
    if (service_id) {
      conditions.push(eq(serviceItem.service_id, service_id));
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
    const serviceitemsWithDetails = await Promise.all(
      result.map(async (row) => ({
        ...row.service_item,
        product: {
          ...row.product,
        },
        serialize_items: await this.getSerBySerialIds(
          row.service_item.serialize_items ?? [],
        ),
      })),
    );

    return { totalData, serviceitemsWithDetails };
  }

  async getServiceItemById(service_item_id: number) {
    const result = await this.db
      .select()
      .from(serviceItem)
      .leftJoin(product, eq(product.product_id, serviceItem.product_id))

      .where(eq(serviceItem.service_item_id, Number(service_item_id)));

    const serviceitemsWithDetails = result.map((row) => ({
      ...row.service_item,
      product: {
        ...row.product,
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
  private async getSerBySerialIds(serialIds: number[]) {
    const result = await this.db
      .select()
      .from(serializeProduct)
      .where(inArray(serializeProduct.serial_id, serialIds));
    return result;
  }
}

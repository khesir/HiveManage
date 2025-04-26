import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { SchemaType } from '@/drizzle/schema/type';
import { serializedserviceRecord } from '@/drizzle/schema/ims/schema/service/serviceSerializeItem.schema';
import { CreateSerializeServiceItem } from './serializedServItem.model';
import { serializeProduct } from '@/drizzle/schema/ims';
import { serviceItem } from '@/drizzle/schema/ims/schema/service/serviceItems.schema';

export class SerializeServiceItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createSerializeServiceItem(data: CreateSerializeServiceItem) {
    await this.db.insert(serializedserviceRecord).values(data);
  }

  async getAllSerializeServiceItem(
    serial_id: string | undefined,
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(serializedserviceRecord.deleted_at)];

    if (serial_id) {
      conditions.push(eq(serializedserviceRecord.serial_id, Number(serial_id)));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(serializedserviceRecord)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(serializedserviceRecord)
      .leftJoin(
        serializeProduct,
        eq(serializeProduct.serial_code, serializedserviceRecord.serial_id),
      )
      .leftJoin(
        serviceItem,
        eq(
          serviceItem.service_item_id,
          serializedserviceRecord.service_item_id,
        ),
      )
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(serializedserviceRecord.created_at)
          : desc(serializedserviceRecord.created_at),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const serializedserviceproductsWithDetails = result.map((row) => ({
      ...row.service_serialize_record,
      serializedProduct: {
        ...row.serialized_product,
      },
      serviceItem: {
        ...row.service_item,
      },
    }));

    return { totalData, serializedserviceproductsWithDetails };
  }

  async getSerializeServiceItemById(service_serilize_record_id: number) {
    const result = await this.db
      .select()
      .from(serializedserviceRecord)
      .leftJoin(
        serializeProduct,
        eq(serializeProduct.serial_code, serializedserviceRecord.serial_id),
      )
      .leftJoin(
        serviceItem,
        eq(
          serviceItem.service_item_id,
          serializedserviceRecord.service_item_id,
        ),
      )
      .where(
        eq(
          serializedserviceRecord.service_serilize_record_id,
          Number(service_serilize_record_id),
        ),
      );

    const serializedserviceproductsWithDetails = result.map((row) => ({
      ...row.service_serialize_record,
      serializedProduct: {
        ...row.serialized_product,
      },
      serviceItem: {
        ...row.service_item,
      },
    }));
    return serializedserviceproductsWithDetails;
  }

  async updateSerializeServiceItem(data: object, paramsId: number) {
    await this.db
      .update(serializedserviceRecord)
      .set(data)
      .where(
        eq(
          serializedserviceRecord.service_serilize_record_id,
          Number(paramsId),
        ),
      );
  }

  async deleteSerializeServiceItem(paramsId: number): Promise<void> {
    await this.db
      .update(serializedserviceRecord)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(serializedserviceRecord.service_serilize_record_id, paramsId));
  }
}

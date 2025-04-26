import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { SchemaType } from '@/drizzle/schema/type';
import { serviceRecord } from '@/drizzle/schema/ims/schema/service/serviceRecord.schema';
import { CreateServiceRecord } from './serviceRecord.model';
import { productRecord } from '@/drizzle/schema/ims';
import { serviceItem } from '@/drizzle/schema/ims/schema/service/serviceItems.schema';

export class ServiceRecordService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createServiceRecord(data: CreateServiceRecord) {
    await this.db.insert(serviceRecord).values(data);
  }

  async getAllServiceRecord(
    product_record_id: string | undefined,
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(serviceRecord.deleted_at)];

    if (product_record_id) {
      conditions.push(
        eq(serviceRecord.product_record_id, Number(product_record_id)),
      );
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(serviceRecord)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(serviceRecord)
      .leftJoin(
        productRecord,
        eq(productRecord.product_record_id, serviceRecord.product_record_id),
      )
      .leftJoin(
        serviceItem,
        eq(serviceItem.service_item_id, serviceRecord.service_item_id),
      )
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(serviceRecord.created_at)
          : desc(serviceRecord.created_at),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const serviceRecordsWithDetails = result.map((row) => ({
      ...row.service_record,
      productRecord: {
        ...row.product_record,
      },
      serviceItem: {
        ...row.service_item,
      },
    }));

    return { totalData, serviceRecordsWithDetails };
  }

  async getServiceRecordById(service_record_id: number) {
    const result = await this.db
      .select()
      .from(serviceRecord)
      .leftJoin(
        productRecord,
        eq(productRecord.product_record_id, serviceRecord.product_record_id),
      )
      .leftJoin(
        serviceItem,
        eq(serviceItem.service_item_id, serviceRecord.service_item_id),
      )
      .where(eq(serviceRecord.service_record_id, Number(service_record_id)));

    const serviceRecordsWithDetails = result.map((row) => ({
      ...row.service_record,
      productRecord: {
        ...row.product_record,
      },
      serviceItem: {
        ...row.service_item,
      },
    }));
    return serviceRecordsWithDetails;
  }

  async updateServiceRecord(data: object, paramsId: number) {
    await this.db
      .update(serviceRecord)
      .set(data)
      .where(eq(serviceRecord.service_record_id, Number(paramsId)));
  }

  async deleteServiceRecord(paramsId: number): Promise<void> {
    await this.db
      .update(serviceRecord)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(serviceRecord.service_record_id, paramsId));
  }
}

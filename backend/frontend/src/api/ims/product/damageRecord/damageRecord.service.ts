import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { SchemaType } from '@/drizzle/schema/type';
import { damageRecord } from '@/drizzle/schema/ims/schema/damage/damageRecord.schema';
import { CreateDamageRecord } from './damageRecord.model';
import { serviceRecord } from '@/drizzle/schema/ims/schema/service/serviceRecord.schema';
import { product } from '@/drizzle/schema/ims';
import { damageItem } from '@/drizzle/schema/ims/schema/damage/damageItems.schema';

export class DamageRecordService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createDamageRecord(data: CreateDamageRecord) {
    await this.db.insert(damageRecord).values(data);
  }

  async getAllDamageRecord(
    product_id: string | undefined,
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(damageRecord.deleted_at)];

    if (product_id) {
      conditions.push(eq(damageRecord.product_id, Number(product_id)));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(damageRecord)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(damageRecord)
      .leftJoin(
        serviceRecord,
        eq(serviceRecord.service_record_id, damageRecord.service_record_id),
      )
      .leftJoin(product, eq(product.product_id, damageRecord.product_id))
      .leftJoin(
        damageItem,
        eq(damageItem.damage_item_id, damageRecord.damage_item_id),
      )
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(damageRecord.created_at)
          : desc(damageRecord.created_at),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const damageRecordWithDetails = result.map((row) => ({
      ...row.damage_record,
      service_record: {
        ...row.service_record,
      },
      product: {
        ...row.product,
      },
      damage_item: {
        ...row.damage_item,
      },
    }));

    return { totalData, damageRecordWithDetails };
  }

  async getDamageRecordById(damage_record_id: number) {
    const result = await this.db
      .select()
      .from(damageRecord)
      .leftJoin(
        serviceRecord,
        eq(serviceRecord.service_record_id, damageRecord.service_record_id),
      )
      .leftJoin(product, eq(product.product_id, damageRecord.product_id))
      .leftJoin(
        damageItem,
        eq(damageItem.damage_item_id, damageRecord.damage_item_id),
      )
      .where(eq(damageRecord.damage_record_id, Number(damage_record_id)));

    const damageRecordWithDetails = result.map((row) => ({
      ...row.damage_record,
      service_record: {
        ...row.service_record,
      },
      product: {
        ...row.product,
      },
      damage_item: {
        ...row.damage_item,
      },
    }));
    return damageRecordWithDetails;
  }

  async updateDamageRecord(data: object, paramsId: number) {
    await this.db
      .update(damageRecord)
      .set(data)
      .where(eq(damageRecord.damage_record_id, Number(paramsId)));
  }

  async deleteDamageRecord(paramsId: number): Promise<void> {
    await this.db
      .update(damageRecord)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(damageRecord.damage_record_id, paramsId));
  }
}

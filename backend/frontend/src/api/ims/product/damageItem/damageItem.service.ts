import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { SchemaType } from '@/drizzle/schema/type';
import { CreateDamageItem } from './damageItem.model';
import { damageItem } from '@/drizzle/schema/ims/schema/damage/damageItems.schema';
import { product } from '@/drizzle/schema/ims';

export class DamageItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createDamageItem(data: CreateDamageItem) {
    await this.db.insert(damageItem).values(data);
  }

  async getAllDamageItem(
    product_id: string | undefined,
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(damageItem.deleted_at)];

    if (product_id) {
      conditions.push(eq(damageItem.product_id, Number(product_id)));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(damageItem)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(damageItem)
      .leftJoin(product, eq(product.product_id, damageItem.product_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(damageItem.created_at)
          : desc(damageItem.created_at),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const damageitemsWithDetails = result.map((row) => ({
      ...row.damage_item,
      product: {
        ...row.product,
      },
    }));

    return { totalData, damageitemsWithDetails };
  }

  async getDamageItemById(damage_item_id: number) {
    const result = await this.db
      .select()
      .from(damageItem)
      .leftJoin(product, eq(product.product_id, damageItem.product_id))
      .where(eq(damageItem.damage_item_id, Number(damage_item_id)));

    const damageitemsWithDetails = result.map((row) => ({
      ...row.damage_item,
      product: {
        ...row.product,
      },
    }));
    return damageitemsWithDetails;
  }

  async updateDamageItem(data: object, paramsId: number) {
    await this.db
      .update(damageItem)
      .set(data)
      .where(eq(damageItem.damage_item_id, Number(paramsId)));
  }

  async deleteDamageItem(paramsId: number): Promise<void> {
    await this.db
      .update(damageItem)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(damageItem.damage_item_id, paramsId));
  }
}

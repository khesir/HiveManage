import {
  item,
  item_record,
  SchemaType,
  variant,
} from '@/drizzle/drizzle.config';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateItem } from './item.model';
import { isNull, eq, sql, and, asc, desc } from 'drizzle-orm';

export class ItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createItem(data: CreateItem) {
    await this.db.insert(item).values(data);
  }

  async getAllItem(
    item_record_id: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(item.deleted_at)];

    if (item_record_id) {
      conditions.push(eq(item.item_record_id, Number(item_record_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(item)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(item)
      .leftJoin(
        item_record,
        eq(item_record.item_record_id, item.item_record_id),
      )
      .leftJoin(variant, eq(variant.variant_id, item.variant_id))
      .where(and(...conditions))
      .orderBy(sort === 'asc' ? asc(item.created_at) : desc(item.created_at))
      .limit(limit)
      .offset(offset);

    const itemWithDetails = result.map((row) => ({
      ...row.item,
      item_record: {
        ...row.item_record,
      },
      variant: {
        ...row.variant,
      },
    }));
    return { totalData, itemWithDetails };
  }

  async getItemByID(item_id: string) {
    const result = await this.db
      .select()
      .from(item)
      .leftJoin(
        item_record,
        eq(item_record.item_record_id, item.item_record_id),
      )
      .leftJoin(variant, eq(variant.variant_id, item.variant_id))
      .where(eq(item.item_id, Number(item_id)));

    const itemWithDetails = result.map((row) => ({
      ...row.item,
      item_record: {
        ...row.item_record,
      },
      variant: {
        ...row.variant,
      },
    }));

    return itemWithDetails;
  }

  async updateItem(data: object, paramsId: number) {
    await this.db.update(item).set(data).where(eq(item.item_id, paramsId));
  }

  async deleteItem(paramsId: number): Promise<void> {
    await this.db
      .update(item)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(item.item_id, paramsId));
  }
}

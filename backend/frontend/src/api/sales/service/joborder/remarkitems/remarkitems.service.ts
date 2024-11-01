import { and, eq, isNull, sql } from 'drizzle-orm';
import {
  item,
  remarkitems,
  remarktickets,
  SchemaType,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateRemarkItems, UpdateRemarkItems } from './remarkitems.model';

export class RemarkItemsService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createRemarkItems(data: CreateRemarkItems) {
    await this.db.insert(remarkitems).values(data);
  }

  async getAllRemarkItems(
    no_pagination: boolean,
    remark_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(remarkitems.deleted_at)];

    if (remark_id) {
      conditions.push(eq(remarkitems.remark_id, Number(remark_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(remarkitems)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(remarkitems)
      .leftJoin(item, eq(item.item_id, remarkitems.remark_items_id))
      .leftJoin(
        remarktickets,
        eq(remarktickets.remark_id, remarkitems.remark_id),
      )
      .where(and(...conditions));

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }
    const result = await query;
    const remarkitemsWithDetails = result.map((row) => ({
      remark_items_id: row.remarkitems.remark_items_id,
      item: {
        item_id: row.item?.item_id,
        product_id: row.item?.product_id,
        stock: row.item?.stock,
        price: row.item?.price,
        on_listing: row.item?.on_listing,
        re_order_level: row.item?.re_order_level,
        tag: row.item?.tag,
        created_at: row.item?.created_at,
        last_updated: row.item?.last_updated,
        deleted_at: row.item?.deleted_at,
      },
      remarktickets: {
        remark_id: row.remarktickets?.remark_id,
        job_order_id: row.remarktickets?.job_order_id,
        created_by: row.remarktickets?.created_by,
        description: row.remarktickets?.description,
        remarktickets_status: row.remarktickets?.remarktickets_status,
        created_at: row.remarktickets?.created_at,
        last_updated: row.remarktickets?.last_updated,
        deleted_at: row.remarktickets?.deleted_at,
      },
      created_at: row.remarkitems?.created_at,
      last_updated: row.remarkitems?.last_updated,
      deleted_at: row.remarkitems?.deleted_at,
    }));

    return { totalData, remarkitemsWithDetails };
  }

  async getRemarkItemsById(remark_id: number) {
    const result = await this.db
      .select()
      .from(remarkitems)
      .leftJoin(item, eq(item.item_id, remarkitems.remark_items_id))
      .leftJoin(
        remarktickets,
        eq(remarktickets.remark_id, remarkitems.remark_id),
      )
      .where(eq(remarkitems.remark_id, Number(remark_id)));

    const remarkitemsWithDetails = result.map((row) => ({
      remark_items_id: row.remarkitems.remark_items_id,
      item: {
        item_id: row.item?.item_id,
        product_id: row.item?.product_id,
        stock: row.item?.stock,
        price: row.item?.price,
        on_listing: row.item?.on_listing,
        re_order_level: row.item?.re_order_level,
        tag: row.item?.tag,
        created_at: row.item?.created_at,
        last_updated: row.item?.last_updated,
        deleted_at: row.item?.deleted_at,
      },
      remarktickets: {
        remark_id: row.remarktickets?.remark_id,
        remark_type_id: row.remarktickets?.remark_type_id,
        job_order_id: row.remarktickets?.job_order_id,
        description: row.remarktickets?.description,
        content: row.remarktickets?.content,
        remarktickets_status: row.remarktickets?.remarktickets_status,
        created_by: row.remarktickets?.created_by,
        deadline: row.remarktickets?.deadline,
        created_at: row.remarktickets?.created_at,
        last_updated: row.remarktickets?.last_updated,
        deleted_at: row.remarktickets?.deleted_at,
      },
      created_at: row.remarkitems?.created_at,
      last_updated: row.remarkitems?.last_updated,
      deleted_at: row.remarkitems?.deleted_at,
    }));
    return remarkitemsWithDetails;
  }

  async updateRemarkItems(data: UpdateRemarkItems, paramsId: number) {
    await this.db
      .update(remarkitems)
      .set(data)
      .where(eq(remarkitems.remark_items_id, paramsId));
  }

  async deleteRemarkItems(paramsId: number): Promise<void> {
    await this.db
      .update(remarkitems)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(remarkitems.remark_items_id, paramsId));
  }
}

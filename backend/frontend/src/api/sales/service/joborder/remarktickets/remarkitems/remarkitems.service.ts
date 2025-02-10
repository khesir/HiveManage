import { and, eq, isNull, sql } from 'drizzle-orm';

import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateRemarkItems, UpdateRemarkItems } from './remarkitems.model';
import { product } from '@/drizzle/schema/ims';
import { SchemaType } from '@/drizzle/schema/type';

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
      .leftJoin(product, eq(product.product_id, remarkitems.product_id))
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
      ...row.remarkitems,
      product: {
        ...row.product,
      },
      remarktickets: {
        ...row.remarktickets,
      },
    }));

    return { totalData, remarkitemsWithDetails };
  }

  async getRemarkItemsById(remark_id: number) {
    const result = await this.db
      .select()
      .from(remarkitems)
      .leftJoin(product, eq(product.product_id, remarkitems.product_id))
      .leftJoin(
        remarktickets,
        eq(remarktickets.remark_id, remarkitems.remark_id),
      )
      .where(eq(remarkitems.remark_id, Number(remark_id)));

    const remarkitemsWithDetails = result.map((row) => ({
      ...row.remarkitems,
      product: {
        ...row.product,
      },
      remarktickets: {
        ...row.remarktickets,
      },
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

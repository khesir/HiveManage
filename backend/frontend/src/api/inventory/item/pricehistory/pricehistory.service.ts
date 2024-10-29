import {
  item,
  price_history,
  remarktickets,
  SchemaType,
} from '@/drizzle/drizzle.schema';
import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreatePriceHistory } from './pricehistory.model';

export class PriceHistoryService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createPriceHistory(data: CreatePriceHistory) {
    await this.db.insert(price_history).values({
      ...data,
      price: data.price.toString(), // Convert price to string
    });
  }

  async getAllPriceHistory(
    item_id: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(price_history.deleted_at)];

    if (item_id) {
      conditions.push(eq(price_history.item_id, Number(item_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(remarktickets)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(price_history)
      .leftJoin(item, eq(item.item_id, price_history.item_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(price_history.created_at)
          : desc(price_history.created_at),
      )
      .limit(limit)
      .offset(offset);

    const pricehistoryitemWithDetails = result.map((row) => ({
      price_history_id: row.price_history.price_history_id,
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
      price: row.price_history?.price,
      change_date: row.price_history?.change_date,
      created_at: row.price_history?.created_at,
      last_updated: row.price_history?.last_updated,
      deleted_at: row.price_history?.deleted_at,
    }));

    return { totalData, pricehistoryitemWithDetails };
  }

  async getPriceHistoryByID(price_history_id: string) {
    const result = await this.db
      .select()
      .from(price_history)
      .leftJoin(item, eq(item.item_id, price_history.item_id))
      .where(eq(price_history.price_history_id, Number(price_history_id)));

    const pricehistoryitemWithDetails = result.map((row) => ({
      price_history_id: row.price_history.price_history_id,
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
      price: row.price_history?.price,
      change_date: row.price_history?.change_date,
      created_at: row.price_history?.created_at,
      last_updated: row.price_history?.last_updated,
      deleted_at: row.price_history?.deleted_at,
    }));

    return pricehistoryitemWithDetails;
  }

  async updatePriceHistory(data: object, paramsId: number) {
    await this.db
      .update(price_history)
      .set(data)
      .where(eq(price_history.price_history_id, paramsId));
  }

  async deletePriceHistory(paramsId: number): Promise<void> {
    await this.db
      .update(price_history)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(price_history.price_history_id, paramsId));
  }
}

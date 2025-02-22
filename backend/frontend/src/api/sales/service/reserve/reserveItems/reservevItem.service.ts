import { and, eq, isNull, asc, desc, sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { reserve, reserveItems } from '@/drizzle/schema/services';
import { SchemaType } from '@/drizzle/schema/type';
import { product } from '@/drizzle/schema/ims';
import { CreateReserveItem } from './reservevItem.model';

export class ReserveItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createReserveItem(data: CreateReserveItem) {
    await this.db.insert(reserveItems).values(data);
  }

  async getAllReserveItem(
    status: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(reserveItems.deleted_at)];

    if (status) {
      // Define valid statuses as a string union type
      const validStatuses = [
        'Reserved',
        'Confirmed',
        'Cancelled',
        'Pending',
        'Completed',
      ] as const; // 'as const' infers a readonly tuple of strings
      if (validStatuses.includes(status as (typeof validStatuses)[number])) {
        conditions.push(
          eq(reserveItems.status, status as (typeof validStatuses)[number]),
        );
      } else {
        throw new Error(`Invalid payment status: ${status}`);
      }
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(reserveItems)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(reserveItems)
      .leftJoin(product, eq(product.product_id, reserveItems.product_id))
      .leftJoin(reserve, eq(reserve.reserve_id, reserveItems.reserve_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(reserveItems.created_at)
          : desc(reserveItems.created_at),
      )
      .limit(limit)
      .offset(offset);
    const reserveitemWithDetails = result.map((row) => ({
      ...row.reserve_items,
      product: {
        ...row.product,
        reserve: {
          ...row.reserve,
        },
      },
    }));

    return { totalData, reserveitemWithDetails };
  }

  async getReserveItemById(reserve_item_id: number) {
    const result = await this.db
      .select()
      .from(reserveItems)
      .leftJoin(product, eq(product.product_id, reserveItems.product_id))
      .leftJoin(reserve, eq(reserve.reserve_id, reserveItems.reserve_id))
      .where(eq(reserveItems.reserve_item_id, Number(reserve_item_id)));

    const reserveitemsWithDetails = result.map((row) => ({
      ...row.reserve,
      product: {
        ...row.product,
        reserve: {
          ...row.reserve,
        },
      },
    }));

    return reserveitemsWithDetails;
  }

  async updateReserveItem(data: object, paramsId: number) {
    await this.db
      .update(reserveItems)
      .set(data)
      .where(eq(reserveItems.reserve_item_id, paramsId));
  }

  async deleteReserveItem(paramsId: number): Promise<void> {
    await this.db
      .update(reserveItems)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(reserveItems.reserve_item_id, paramsId));
  }
}

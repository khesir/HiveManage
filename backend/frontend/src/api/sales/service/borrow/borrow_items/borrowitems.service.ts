import { and, eq, isNull, asc, desc, sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { borrow, borrowItems } from '@/drizzle/schema/services';
import { SchemaType } from '@/drizzle/schema/type';
import { product } from '@/drizzle/schema/ims';
import { CreateBorrowItem } from './borrowitems.model';

export class BorrowItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createBorrowItem(data: CreateBorrowItem) {
    await this.db.insert(borrowItems).values(data);
  }

  async getAllBorrowItem(
    status: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(borrowItems.deleted_at)];

    if (status) {
      const validStatuses = [
        'Requested',
        'Approved',
        'Borrowed',
        'Returned',
        'Overdue',
        'Rejected',
        'Cancelled',
        'Lost',
        'Damaged',
      ] as const;
      if (validStatuses.includes(status as (typeof validStatuses)[number])) {
        conditions.push(
          eq(borrowItems.status, status as (typeof validStatuses)[number]),
        );
      } else {
        throw new Error(`Invalid borrow item status: ${status}`);
      }
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(borrowItems)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(borrowItems)
      .leftJoin(product, eq(product.product_id, borrowItems.product_id))
      .leftJoin(borrow, eq(borrow.borrow_id, borrowItems.borrow_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(borrowItems.created_at)
          : desc(borrowItems.created_at),
      )
      .limit(limit)
      .offset(offset);
    const borrowitemWithDetails = result.map((row) => ({
      ...row.borrow_items,
      product: {
        ...row.product,
        reserve: {
          ...row.borrow,
        },
      },
    }));

    return { totalData, borrowitemWithDetails };
  }

  async getBorrowItemById(borrow_item_id: number) {
    const result = await this.db
      .select()
      .from(borrowItems)
      .leftJoin(product, eq(product.product_id, borrowItems.product_id))
      .leftJoin(borrow, eq(borrow.borrow_id, borrowItems.borrow_id))
      .where(eq(borrowItems.borrow_item_id, Number(borrow_item_id)));

    const borrowitemsWithDetails = result.map((row) => ({
      ...row.borrow_items,
      product: {
        ...row.product,
        reserve: {
          ...row.borrow,
        },
      },
    }));

    return borrowitemsWithDetails;
  }

  async updateBorrowItem(data: object, paramsId: number) {
    await this.db
      .update(borrowItems)
      .set(data)
      .where(eq(borrowItems.borrow_item_id, paramsId));
  }

  async deleteBorrowItem(paramsId: number): Promise<void> {
    await this.db
      .update(borrowItems)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(borrowItems.borrow_item_id, paramsId));
  }
}

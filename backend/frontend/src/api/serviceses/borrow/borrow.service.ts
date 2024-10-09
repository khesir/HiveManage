import { and, eq, isNull } from 'drizzle-orm';
import { borrow } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateBorrow } from './borrow.model';

export class BorrowService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createBorrow(data: CreateBorrow) {
    await this.db.insert(borrow).values(data);
  }

  async getAllBorrow(
    borrow_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    try {
      if (borrow_id) {
        const result = await this.db
          .select()
          .from(borrow)
          .where(
            and(
              eq(borrow.borrow_id, Number(borrow_id)),
              isNull(borrow.deleted_at),
            ),
          )
          .limit(limit)
          .offset(offset);
        return result;
      } else {
        const result = await this.db
          .select()
          .from(borrow)
          .where(isNull(borrow.deleted_at))
          .limit(limit)
          .offset(offset);
        return result;
      }
    } catch (error) {
      console.error('Error fetching borrow: ', error);
      throw new Error('Error fetching borrows');
    }
  }

  async getBorrowById(paramsId: number) {
    const result = await this.db
      .select()
      .from(borrow)
      .where(eq(borrow.borrow_id, paramsId));
    return result[0];
  }

  async updateBorrow(data: object, paramsId: number) {
    await this.db
      .update(borrow)
      .set(data)
      .where(eq(borrow.borrow_id, paramsId));
  }

  async deleteBorrow(paramsId: number): Promise<void> {
    await this.db
      .update(borrow)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(borrow.borrow_id, paramsId));
  }
}

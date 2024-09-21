import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { and, eq, isNull } from 'drizzle-orm';
import { receipt } from '../../../../drizzle/drizzle.schema';

export class ReceiptService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createReceipt(data: object) {
    await this.db.insert(receipt).values(data);
  }

  async getAllReceipt(
    receipt_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    try {
      if (receipt_id) {
        const result = await this.db
          .select()
          .from(receipt)
          .where(
            and(
              eq(receipt.receipt_id, Number(receipt_id)),
              isNull(receipt.deleted_at),
            ),
          )
          .limit(limit)
          .offset(offset);
        return result;
      } else {
        const result = await this.db
          .select()
          .from(receipt)
          .where(isNull(receipt.deleted_at))
          .limit(limit)
          .offset(offset);
        return result;
      }
    } catch (error) {
      console.error('Error fetching receipt: ', error);
      throw new Error('Error fetching receipt');
    }
  }

  async getReceiptById(paramsId: number) {
    const result = await this.db
      .select()
      .from(receipt)
      .where(eq(receipt.receipt_id, paramsId));
    return result[0];
  }

  async updateReceipt(data: object, paramsId: number) {
    await this.db
      .update(receipt)
      .set(data)
      .where(eq(receipt.receipt_id, paramsId));
  }

  async deleteReceipt(paramsId: number): Promise<void> {
    await this.db
      .update(receipt)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(receipt.receipt_id, paramsId));
  }
}

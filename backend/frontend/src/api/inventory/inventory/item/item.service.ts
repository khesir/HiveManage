import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { and, eq, isNull } from 'drizzle-orm';
import { item } from '../../../../../drizzle/drizzle.schema';

export class ItemService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createItem(data: object) {
    await this.db.insert(item).values(data);
  }

  async getAllItem(item_id: string | undefined, limit: number, offset: number) {
    try {
      if (item_id) {
        // Query by item_Id with limit and offset
        const result = await this.db
          .select()
          .from(item)
          .where(
            and(eq(item.item_id, Number(item_id)), isNull(item.deleted_at)),
          )
          .limit(limit)
          .offset(offset);
        return result;
      } else {
        //Query all items with limit and offset
        const result = await this.db
          .select()
          .from(item)
          .where(isNull(item.deleted_at))
          .limit(limit)
          .offset(offset);
        return result;
      }
    } catch (error) {
      console.error('Error fetching suppliers: ', error);
      throw new Error('Error fetching suppliers');
    }
  }

  async getItemById(paramsId: number) {
    const result = await this.db
      .select()
      .from(item)
      .where(eq(item.item_id, paramsId));
    return result[0];
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

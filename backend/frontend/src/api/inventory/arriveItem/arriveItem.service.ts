import { eq, isNull } from 'drizzle-orm';
import { arrived_Items, SchemaType } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class ArriveItemsService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createArriveItems(data: object) {
    await this.db.insert(arrived_Items).values(data);
  }

  async getAllArriveItems(limit: number, offset: number) {
    const result = await this.db
      .select()
      .from(arrived_Items)
      .where(isNull(arrived_Items.deleted_at))
      .limit(limit)
      .offset(offset);
    return result;
  }

  async getArriveItemsById(paramsId: number) {
    const result = await this.db
      .select()
      .from(arrived_Items)
      .where(eq(arrived_Items.arrived_Items_id, paramsId));
    return result[0];
  }

  async updateArriveItems(data: object, paramsId: number) {
    await this.db
      .update(arrived_Items)
      .set(data)
      .where(eq(arrived_Items.arrived_Items_id, paramsId));
  }

  async deleteArriveItems(paramsId: number): Promise<void> {
    await this.db
      .update(arrived_Items)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(arrived_Items.arrived_Items_id, paramsId));
  }
}

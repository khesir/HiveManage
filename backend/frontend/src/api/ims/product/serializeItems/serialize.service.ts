import { SchemaType, serializeItems } from '@/drizzle/drizzle.config';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { CreateSerialize } from './serialize.model';

export class SerializeItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createSerializeItem(data: CreateSerialize) {
    const batchData = {
      ...data,
      status: data.item_status || 'New',
      condition: data.item_condition || 'Active',
    };
    await this.db.insert(serializeItems).values(batchData);
  }

  async getAllSerializeItem(item_id: number) {
    const data = await this.db
      .select()
      .from(serializeItems)
      .where(eq(serializeItems.item_id, item_id));
    return data;
  }

  async getSerializeItemByID(serial_id: string) {
    const data = await this.db
      .select()
      .from(serializeItems)
      .where(eq(serializeItems.serialized_item_id, Number(serial_id)));
    return data;
  }

  async updateSerializeItem(data: object, paramsId: number) {
    await this.db
      .update(serializeItems)
      .set(data)
      .where(eq(serializeItems.serialized_item_id, Number(paramsId)));
  }

  async deleteSerializeItem(paramsId: number): Promise<void> {
    await this.db
      .update(serializeItems)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(serializeItems.serialized_item_id, paramsId));
  }
}

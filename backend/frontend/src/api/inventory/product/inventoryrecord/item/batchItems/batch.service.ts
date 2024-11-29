import { batchItems, SchemaType } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { CreateBatch } from './batch.model';

export class BatchService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createBatch(data: CreateBatch) {
    const batchData = {
      ...data,
      status: data.item_status || 'New',
      condition: data.item_condition || 'Active',
    };
    await this.db.insert(batchItems).values(batchData);
  }

  async getAllBatch(item_id: number) {
    const data = await this.db
      .select()
      .from(batchItems)
      .where(eq(batchItems.item_id, item_id));
    return data;
  }

  async getBatchByID(batch_id: string) {
    const data = await this.db
      .select()
      .from(batchItems)
      .where(eq(batchItems.batch_item_id, Number(batch_id)));
    return data;
  }

  async updateBatch(data: object, paramsId: number) {
    await this.db
      .update(batchItems)
      .set(data)
      .where(eq(batchItems.batch_item_id, Number(paramsId)));
  }

  async deleteBatch(paramsId: number): Promise<void> {
    await this.db
      .update(batchItems)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(batchItems.batch_item_id, paramsId));
  }
}

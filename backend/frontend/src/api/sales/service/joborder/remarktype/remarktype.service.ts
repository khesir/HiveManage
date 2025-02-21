import { eq, isNull } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateRemarkType } from './remarktype.model';
import { SchemaType } from '@/drizzle/schema/type';
import { remarkType } from '@/drizzle/schema/services/schema/joborder/remarkType.schema';

export class RemarkTypeService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createRemarkType(data: CreateRemarkType) {
    await this.db.insert(remarkType).values(data);
  }

  async getAllRemarkType() {
    const result = await this.db
      .select()
      .from(remarkType)
      .where(isNull(remarkType.deleted_at));
    return result;
  }

  async getRemarkTypeById(paramsId: number) {
    const result = await this.db
      .select()
      .from(remarkType)
      .where(eq(remarkType.remark_type_id, paramsId));
    return result[0];
  }

  async updateRemarkType(data: object, paramsId: number) {
    await this.db
      .update(remarkType)
      .set(data)
      .where(eq(remarkType.remark_type_id, paramsId));
  }

  async deleteRemarkType(paramsId: number): Promise<void> {
    await this.db
      .update(remarkType)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(remarkType.remark_type_id, paramsId));
  }
}

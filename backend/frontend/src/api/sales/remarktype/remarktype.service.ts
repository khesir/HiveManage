import { eq, isNull } from 'drizzle-orm';
import { remarktype, SchemaType } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateRemarkType } from './remarktype.model';

export class RemarkTypeService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createRemarkType(data: CreateRemarkType) {
    await this.db.insert(remarktype).values(data);
  }

  async getAllRemarkType() {
    const result = await this.db
      .select()
      .from(remarktype)
      .where(isNull(remarktype.deleted_at));
    return result;
  }

  async getRemarkTypeById(paramsId: number) {
    const result = await this.db
      .select()
      .from(remarktype)
      .where(eq(remarktype.remark_type_id, paramsId));
    return result[0];
  }

  async updateRemarkType(data: object, paramsId: number) {
    await this.db
      .update(remarktype)
      .set(data)
      .where(eq(remarktype.remark_type_id, paramsId));
  }

  async deleteRemarkType(paramsId: number): Promise<void> {
    await this.db
      .update(remarktype)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(remarktype.remark_type_id, paramsId));
  }
}

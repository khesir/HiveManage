import { eq, isNull } from 'drizzle-orm';
import { remarkcontent, SchemaType } from '@/drizzle/drizzle.config';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateRemarkContent } from './remarkcontent.model';

export class RemarkContentService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createRemarkContent(data: CreateRemarkContent) {
    await this.db.insert(remarkcontent).values(data);
  }

  async getAllRemarkContent(limit: number, offset: number) {
    const result = await this.db
      .select()
      .from(remarkcontent)
      .where(isNull(remarkcontent.deleted_at))
      .limit(limit)
      .offset(offset);
    return result;
  }

  async getRemarkContentById(paramsId: number) {
    const result = await this.db
      .select()
      .from(remarkcontent)
      .where(eq(remarkcontent.remarkcontent_id, paramsId));
    return result[0];
  }

  async updateRemarkContent(data: object, paramsId: number) {
    await this.db
      .update(remarkcontent)
      .set(data)
      .where(eq(remarkcontent.remarkcontent_id, paramsId));
  }

  async deleteRemarkContent(paramsId: number): Promise<void> {
    await this.db
      .update(remarkcontent)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(remarkcontent.remarkcontent_id, paramsId));
  }
}

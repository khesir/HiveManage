import { eq, isNull, sql } from 'drizzle-orm';
import { category, SchemaType } from '@/drizzle/drizzle.config';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class CategoryService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createCategory(data: object) {
    await this.db.insert(category).values(data);
  }

  async getAllCategory(limit: number, offset: number, no_pagination: boolean) {
    const totalCountQuery = await this.db
      .select({ count: sql<number>`COUNT(*)` })
      .from(category)
      .where(isNull(category.deleted_at));
    const totalData = totalCountQuery[0].count;
    const query = this.db
      .select()
      .from(category)
      .where(isNull(category.deleted_at));

    if (no_pagination) {
      query.limit(limit).offset(offset);
    }
    const result = await query;

    return { result, totalData };
  }

  async getCategoryById(paramsId: number) {
    const result = await this.db
      .select()
      .from(category)
      .where(eq(category.category_id, paramsId));
    return result[0];
  }

  async updateCategory(data: object, paramsId: number) {
    await this.db
      .update(category)
      .set(data)
      .where(eq(category.category_id, paramsId));
  }

  async deleteCategory(paramsId: number): Promise<void> {
    await this.db
      .update(category)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(category.category_id, paramsId));
  }
}

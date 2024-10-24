import { eq, isNull } from 'drizzle-orm';
import { category } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class CategoryService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createCategory(data: object) {
    await this.db.insert(category).values(data);
  }

  async getAllCategory(limit: number, offset: number) {
    const result = await this.db
      .select()
      .from(category)
      .where(isNull(category.deleted_at))
      .limit(limit)
      .offset(offset);
    return result;
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

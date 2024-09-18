import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { and, eq, isNull } from 'drizzle-orm';
import { category } from '../../../../../drizzle/drizzle.schema';

export class CategoryService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createCategory(data: object) {
    await this.db.insert(category).values(data);
  }

  async getAllCategory(
    category_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    try {
      if (category_id) {
        // Query by supplierId with limit and offset
        const result = await this.db
          .select()
          .from(category)
          .where(
            and(
              eq(category.category_id, Number(category_id)),
              isNull(category.deleted_at),
            ),
          )
          .limit(limit)
          .offset(offset);
        return result;
      } else {
        //Query all suppliers with limit and offset
        const result = await this.db
          .select()
          .from(category)
          .where(isNull(category.deleted_at))
          .limit(limit)
          .offset(offset);
        return result;
      }
    } catch (error) {
      console.error('Error fetching suppliers: ', error);
      throw new Error('Error fetching suppliers');
    }
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

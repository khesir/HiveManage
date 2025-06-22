import { and, eq, isNull, sql, desc, asc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { customerGroup } from '@/drizzle/schema/customer';

export class CustomerGroupService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createCustomerGroup(data: object) {
    await this.db.insert(customerGroup).values(data);
  }

  async getAllCustomerGroup(sort: string, limit: number, offset: number) {
    const conditions = [isNull(customerGroup.deleted_at)];

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(customerGroup)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(customerGroup)
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(customerGroup.created_at)
          : desc(customerGroup.created_at),
      )
      .limit(limit)
      .offset(offset);

    return {
      totalData,
      result,
    };
  }

  async getCustomerGroupById(paramsId: number) {
    const result = await this.db
      .select()
      .from(customerGroup)
      .where(eq(customerGroup.customer_group_id, paramsId));
    return result[0];
  }

  async updateCustomerGroup(data: object, paramsId: number) {
    await this.db
      .update(customerGroup)
      .set(data)
      .where(eq(customerGroup.customer_group_id, paramsId));
  }

  async deleteCustomerGroup(customergroupId: number): Promise<void> {
    await this.db
      .update(customerGroup)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(customerGroup.customer_group_id, customergroupId));
  }
}

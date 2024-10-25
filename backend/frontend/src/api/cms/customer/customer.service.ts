import { and, eq, isNull, sql, desc, asc, like, or } from 'drizzle-orm';
import { customer, SchemaType } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateCustomer } from './customer.model';

export class CustomerService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createCustomer(data: CreateCustomer) {
    await this.db.insert(customer).values(data);
  }

  async getAllCustomer(
    email: string | undefined,
    sort: string,
    limit: number,
    offset: number,
    fullname: string | undefined,
  ) {
    const conditions = [isNull(customer.deleted_at)];

    if (email) {
      conditions.push(eq(customer.email, email));
    }

    if (fullname) {
      const likeFullname = `%${fullname}%`; // Partial match
      const nameConditions = or(
        like(customer.firstname, likeFullname),
        like(customer.middlename, likeFullname),
        like(customer.lastname, likeFullname),
      );
      if (nameConditions) {
        conditions.push(nameConditions);
      }
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(customer)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(customer)
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(customer.created_at) : desc(customer.created_at),
      )
      .limit(limit)
      .offset(offset);

    return {
      totalData,
      result,
    };
  }

  async getCustomerById(paramsId: number) {
    const result = await this.db
      .select()
      .from(customer)
      .where(eq(customer.customer_id, paramsId));
    return result[0];
  }

  async updateCustomer(data: object, paramsId: number) {
    await this.db
      .update(customer)
      .set(data)
      .where(eq(customer.customer_id, paramsId));
  }

  async deleteCustomer(customerId: number): Promise<void> {
    await this.db
      .update(customer)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(customer.customer_id, customerId));
  }
}

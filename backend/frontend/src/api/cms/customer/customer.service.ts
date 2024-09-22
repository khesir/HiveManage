import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { and, eq, isNull } from 'drizzle-orm';
import { customer } from '../../../../drizzle/drizzle.schema';

export class CustomerService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createCustomer(data: object) {
    await this.db.insert(customer).values(data);
  }

  async getAllCustomer(
    customer_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    try {
      if (customer_id) {
        const result = await this.db
          .select()
          .from(customer)
          .where(
            and(
              eq(customer.customer_id, Number(customer_id)),
              isNull(customer.deleted_at),
            ),
          )
          .limit(limit)
          .offset(offset);
        return result;
      } else {
        const result = await this.db
          .select()
          .from(customer)
          .where(isNull(customer.deleted_at))
          .limit(limit)
          .offset(offset);
        return result;
      }
    } catch (error) {
      console.error('Error fetching customer: ', error);
      throw new Error('Error fetching customers');
    }
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

  async deleteCustomer(paramsId: number): Promise<void> {
    await this.db
      .update(customer)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(customer.customer_id, paramsId));
  }
}

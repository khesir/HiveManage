import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { asc, desc, eq, isNull } from 'drizzle-orm';
import { order } from '../../../../../drizzle/drizzle.schema';

export class OrderService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createOrder(data: object) {
    await this.db.insert(order).values(data);
  }

  async getAllOrder({ limit = 10, sort = 'asc', page = 1 }) {
    const offset = (page - 1) * limit;
    const result = await this.db
      .select()
      .from(order)
      .where(isNull(order.deleted_at))
      .orderBy(sort === 'asc' ? asc(order.created_at) : desc(order.created_at))
      .limit(limit)
      .offset(offset);
    return result;
  }

  async getOrderById(paramsId: number) {
    const result = await this.db
      .select()
      .from(order)
      .where(eq(order.order_id, paramsId));
    return result[0];
  }

  async updateOrder(data: object, paramsId: number) {
    await this.db.update(order).set(data).where(eq(order.order_id, paramsId));
  }

  async deleteOrder(paramsId: number): Promise<void> {
    await this.db
      .update(order)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(order.order_id, paramsId));
  }
}

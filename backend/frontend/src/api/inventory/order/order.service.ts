import { and, eq, isNull } from 'drizzle-orm';
import { order } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { CreateOrder } from './order.model';

export class OrderService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }
  async createOrder(data: CreateOrder): Promise<void> {
    await this.db.insert(order).values(data);
  }

  async getAllOrder(
    orderId: string | undefined,
    limit: number,
    offset: number,
  ) {
    try {
      if (orderId) {
        const result = await this.db
          .select()
          .from(order)
          .where(
            and(eq(order.order_id, Number(orderId)), isNull(order.deleted_at)),
          )
          .limit(limit)
          .offset(offset);
        return result;
      } else {
        const result = await this.db
          .select()
          .from(order)
          .where(isNull(order.deleted_at))
          .limit(limit)
          .offset(offset);
        return result;
      }
    } catch (error) {
      console.error('Error fetching Order: ', error);
    }
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

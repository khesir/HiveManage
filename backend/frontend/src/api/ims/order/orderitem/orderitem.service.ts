import { asc, desc, eq, isNull, sql, and } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
  CreateOrderItem,
  UpdateOrderItem,
  UpdateStatus,
} from './orderitem.model';
import { order, orderItem, product } from '@/drizzle/schema/ims';
import { SchemaType } from '@/drizzle/schema/type';

export class OrderItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createOrderItem(data: CreateOrderItem) {
    await this.db.insert(orderItem).values(data);
  }

  async getAllOrderItem(
    order_id: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(orderItem.deleted_at)];

    if (order_id) {
      conditions.push(eq(orderItem.order_id, Number(order_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(orderItem)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(orderItem)
      .leftJoin(order, eq(order.order_id, orderItem.order_id))
      .leftJoin(product, eq(product.product_id, orderItem.product_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(orderItem.created_at) : desc(orderItem.created_at),
      )
      .limit(limit)
      .offset(offset);

    const orderitemWithDetails = result.map((row) => ({
      ...row.order_item,
      order: {
        ...row.order,
      },
      product: {
        ...row.product,
      },
    }));
    return { totalData, orderitemWithDetails };
  }

  async getOrderItemById(paramsId: number) {
    const result = await this.db
      .select()
      .from(orderItem)
      .where(eq(orderItem.orderItem_id, paramsId));
    return result[0];
  }

  async updateOrderItem(data: UpdateOrderItem, orderItem_id: string) {
    await this.db
      .update(orderItem)
      .set({ ...data, quantity: Number(data.quantity) })
      .where(eq(orderItem.orderItem_id, Number(orderItem_id)));
  }

  async deleteOrderItem(paramsId: number): Promise<void> {
    await this.db.delete(orderItem).where(eq(orderItem.orderItem_id, paramsId));
  }

  async updateStatus(data: UpdateStatus, orderItem_id: string) {
    await this.db
      .update(orderItem)
      .set({ status: data.status })
      .where(eq(orderItem.orderItem_id, Number(orderItem_id)));
  }
}

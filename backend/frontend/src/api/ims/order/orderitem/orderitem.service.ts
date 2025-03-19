import { asc, desc, eq, isNull, sql, and } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateOrderItem, UpdateOrderItem } from './orderitem.model';
import { order, orderProduct, product } from '@/drizzle/schema/ims';
import { SchemaType } from '@/drizzle/schema/type';

export class OrderItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createOrderItem(data: CreateOrderItem) {
    await this.db.insert(orderProduct).values(data);
  }

  async getAllOrderItem(
    order_id: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(orderProduct.deleted_at)];

    if (order_id) {
      conditions.push(eq(orderProduct.order_id, Number(order_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(orderProduct)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(orderProduct)
      .leftJoin(order, eq(order.order_id, orderProduct.order_id))
      .leftJoin(product, eq(product.product_id, orderProduct.product_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(orderProduct.created_at)
          : desc(orderProduct.created_at),
      )
      .limit(limit)
      .offset(offset);

    const orderitemWithDetails = result.map((row) => ({
      ...row.order_product,
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
      .from(orderProduct)
      .where(eq(orderProduct.order_product_id, paramsId));
    return result[0];
  }

  async updateOrderItem(data: UpdateOrderItem, orderItem_id: string) {
    await this.db
      .update(orderProduct)
      .set({ ...data, quantity: Number(data.quantity) })
      .where(eq(orderProduct.order_product_id, Number(orderItem_id)));
  }

  async deleteOrderItem(paramsId: number): Promise<void> {
    await this.db
      .delete(orderProduct)
      .where(eq(orderProduct.order_product_id, paramsId));
  }
}

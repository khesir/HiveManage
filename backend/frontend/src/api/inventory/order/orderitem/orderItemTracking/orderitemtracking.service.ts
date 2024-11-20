import { eq } from 'drizzle-orm';
import {
  order,
  orderItem,
  orderItemTracking,
  orderLogs,
  product,
  SchemaType,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
  CreateOrderItemTracking,
  UpdateOrderItemTracking,
} from './orderitemtracking.model';

export class OrderItemTrackingService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async getAllOrderItemTracking(orderItem_id: string) {
    const result = await this.db
      .select()
      .from(orderItemTracking)
      .leftJoin(
        orderItem,
        eq(orderItem.orderItem_id, orderItemTracking.orderItem_id),
      )
      .leftJoin(product, eq(product.product_id, orderItem.product_id))
      .leftJoin(order, eq(order.order_id, orderItem.product_id))
      .where(eq(orderItemTracking.orderItem_id, Number(orderItem_id)));
    const finalresult = result.map((row) => ({
      ...row.orderItemTracking,
      product: {
        ...row.product,
      },
      order: {
        ...row.order,
      },
    }));
    return finalresult;
  }

  async getOrderItemTrackingById(id: string) {
    console.log(id);
  }

  async createOrderItemTracking(
    data: CreateOrderItemTracking,
    order_id: string,
    product_id: string | undefined,
    orderItem_id: string,
  ) {
    return this.db.transaction(async (tx) => {
      for (const orderItemData of data.track_record) {
        const modifiedTrack = {
          ...orderItemData,
          orderItem_id: Number(orderItem_id),
        };
        await tx.insert(orderItemTracking).values(modifiedTrack);
        await tx.insert(orderLogs).values({
          order_id: Number(order_id),
          title: `Created Tracking for item #${orderItem_id}`,
          message: 'Create empty state of order, ready for usage',
        });
      }
    });
  }

  async updateOrderItemTracking(data: UpdateOrderItemTracking, id: string) {
    console.log(data);
    console.log(id);
  }

  async deleteOrderItemTracking(paramsId: string): Promise<void> {
    console.log(paramsId);
  }
}

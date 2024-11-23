import { eq } from 'drizzle-orm';
import {
  item_record,
  order,
  orderItem,
  orderItemTracking,
  orderLogs,
  product,
  SchemaType,
  stocksLogs,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
  CreateOrderItemTracking,
  UpdateOrderItemTracking,
} from './orderitemtracking.model';
import { CreateInventoryRecord } from '../../../product/inventoryrecord/itemrecord.model';

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
      .leftJoin(order, eq(order.order_id, orderItem.order_id))
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
          message: 'Currently tracking stocks',
        });
      }
    });
  }

  async updateOrderItemTracking(data: UpdateOrderItemTracking, id: string) {
    await this.db
      .update(orderItemTracking)
      .set({ ...data, quantity: Number(data.quantity) })
      .where(eq(orderItemTracking.tracking_id, Number(id)));
  }

  async deleteOrderItemTracking(paramsId: string): Promise<void> {
    await this.db
      .delete(orderItemTracking)
      .where(eq(orderItemTracking.tracking_id, Number(paramsId)));
  }

  async processItem(data: CreateInventoryRecord, id: string, order_id: string) {
    await this.db.transaction(async (tx) => {
      await tx
        .update(orderItemTracking)
        .set({ isStocked: true })
        .where(eq(orderItemTracking.tracking_id, Number(id)));

      await tx.insert(item_record).values(data);
      await tx.insert(orderLogs).values({
        order_id: Number(order_id),
        title: `Item Pushed to Inventory`,
        message: `${data.stock} Items has been pushed to inventory`,
      });
      await tx.insert(stocksLogs).values({
        product_id: data.product_id,
        quantity: data.stock,
        movement_type: 'Stock-In',
        action: `${data.stock} New Stock added from order`,
      });
    });
  }
}

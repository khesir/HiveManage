import { asc, desc, eq, isNull, sql } from 'drizzle-orm';
import {
  category,
  order,
  orderItem,
  orderLogs,
  product,
  product_category,
  SchemaType,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
  CreateOrderItem,
  UpdateOrderItem,
  UpdateStatus,
} from './orderitem.model';

export class OrderItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createOrderItem(data: CreateOrderItem, order_id: string) {
    return await this.db.transaction(async (tx) => {
      await tx
        .update(order)
        .set({ ordered_value: data.order_value })
        .where(eq(order.order_id, Number(order_id)));

      for (const item of data.order_items) {
        await tx.insert(orderItem).values({
          ...item,
          order_id: Number(order_id),
          quantity: Number(item.quantity),
        });

        await tx.insert(orderLogs).values({
          order_id: Number(order_id),
          title: `Product #${item.product_id} added`,
          message: `Quantity added ${item.quantity}`,
        });
      }
    });
  }

  async getAllOrderItem(sort: string, limit: number, offset: number) {
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(orderItem);

    const totalData = totalCountQuery[0].count;
    const productCategories = await this.db
      .select()
      .from(product_category)
      .leftJoin(
        category,
        eq(category.category_id, product_category.category_id),
      )
      .where(isNull(product_category.deleted_at));

    const categoryByProduct = productCategories.reduce<
      Record<number, unknown[]>
    >((acc, product_category) => {
      const categoryId = product_category.product_category?.category_id;
      if (categoryId !== null && !(categoryId in acc)) {
        acc[categoryId] = [];
      }
      if (categoryId !== null) {
        acc[categoryId].push({
          ...product_category.product_category,
          category: { ...product_category.product_category },
        });
      }
      return acc;
    }, {});
    const result = await this.db
      .select()
      .from(orderItem)
      .leftJoin(order, eq(orderItem.orderItem_id, order.order_id))
      .leftJoin(product, eq(product.product_id, orderItem.product_id))
      .orderBy(
        sort === 'asc' ? asc(orderItem.created_at) : desc(orderItem.created_at),
      )
      .limit(limit)
      .offset(offset);
    const OrderitemsWithDetails = result.map((row) => ({
      ...row.orderItem,
      order: {
        ...row.order,
      },
      product: {
        ...row.product,
        product_categories: categoryByProduct[row.product!.product_id],
      },
    }));
    return { totalData, OrderitemsWithDetails };
  }

  async getOrderItemById(orderItem_id: string) {
    const productCategories = await this.db
      .select()
      .from(product_category)
      .leftJoin(
        category,
        eq(category.category_id, product_category.category_id),
      )
      .where(isNull(product_category.deleted_at));
    const categoryByProduct = productCategories.reduce<
      Record<number, unknown[]>
    >((acc, product_category) => {
      const categoryId = product_category.product_category?.category_id;
      if (categoryId !== null && !(categoryId in acc)) {
        acc[categoryId] = [];
      }
      if (categoryId !== null) {
        acc[categoryId].push({
          ...product_category.product_category,
          category: { ...product_category.product_category },
        });
      }
      return acc;
    }, {});
    const result = await this.db
      .select()
      .from(orderItem)
      .leftJoin(order, eq(orderItem.orderItem_id, order.order_id))
      .leftJoin(product, eq(product.product_id, orderItem.product_id))
      .where(eq(orderItem.orderItem_id, Number(orderItem_id)));

    const OrderitemsWithDetails = result.map((row) => ({
      ...row.orderItem,
      order: {
        ...row.order,
      },
      product: {
        ...row.product,
        categories: categoryByProduct[row.product!.product_id],
      },
    }));

    return OrderitemsWithDetails;
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

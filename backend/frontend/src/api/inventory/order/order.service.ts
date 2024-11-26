import { eq, isNull, sql, asc, desc } from 'drizzle-orm';
import {
  category,
  order,
  orderItem,
  orderLogs,
  item,
  SchemaType,
  supplier,
  product_category,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { CreateOrder } from './order.model';
import { UpdateOrderItem } from './orderitem/orderitem.model';

export class OrderService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async getAllOrder(
    sort: string,
    limit: number,
    offset: number,
    no_pagination: boolean,
    item_id: number | undefined,
  ) {
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(order)
      .where(isNull(order.deleted_at));

    const totalData = totalCountQuery[0].count;
    // Supplier Categories
    const itemCategories = await this.db
      .select()
      .from(product_category)
      .leftJoin(
        category,
        eq(category.category_id, product_category.category_id),
      )
      .where(isNull(product_category.deleted_at));
    const categoryBySupplier = itemCategories.reduce<Record<number, unknown[]>>(
      (acc, product_category) => {
        const supplierID = product_category.product_category.supplier_id;
        if (supplierID !== null && !(supplierID in acc)) {
          acc[supplierID] = [];
        }
        if (supplierID !== null) {
          acc[supplierID].push({
            ...product_category.product_category,
            category: { ...product_category.category },
          });
        }
        return acc;
      },
      {},
    );

    const categoryByProduct = itemCategories.reduce<Record<number, unknown[]>>(
      (acc, product_category) => {
        const itemID = product_category.product_category.supplier_id;
        if (itemID !== null && !(itemID in acc)) {
          acc[itemID] = [];
        }
        if (itemID !== null) {
          acc[itemID].push({
            ...product_category.product_category,
            category: { ...product_category.category },
          });
        }
        return acc;
      },
      {},
    );
    // Order items
    const orderItems = await this.db
      .select()
      .from(orderItem)
      .leftJoin(item, eq(item.item_id, orderItem.item_id));
    const orderItemsByOrderID = orderItems.reduce<Record<number, unknown[]>>(
      (acc, orderItem) => {
        const orderID = orderItem.orderItem.order_id;
        if (orderID !== null && !(orderID in acc)) {
          acc[orderID] = [];
        }
        if (orderID !== null) {
          acc[orderID].push({
            ...orderItem.orderItem,
            item: {
              ...orderItem.item,
              item_categories:
                orderItem.item?.item_id !== undefined
                  ? categoryByProduct[orderItem.item.item_id]
                  : undefined,
            },
          });
        }
        return acc;
      },
      {},
    );
    const orderItemsByProduct = orderItems.reduce<Record<number, unknown[]>>(
      (acc, orderItem) => {
        const itemID = orderItem.orderItem.item_id;
        if (itemID !== null && !(itemID in acc)) {
          acc[itemID] = [];
        }
        if (itemID !== null) {
          acc[itemID].push({
            ...orderItem.orderItem,
            item: {
              ...orderItem.item,
              item_categories:
                orderItem.item?.item_id !== undefined
                  ? categoryByProduct[orderItem.item.item_id]
                  : undefined,
            },
          });
        }
        return acc;
      },
      {},
    );
    const orderLogsData = await this.db
      .select()
      .from(orderLogs)
      .leftJoin(order, eq(order.order_id, orderLogs.order_id));

    const orderLogsByOrderID = orderLogsData.reduce<Record<number, unknown[]>>(
      (acc, logs) => {
        const logsOrderID = logs.orderLogs.order_id;
        if (logsOrderID !== null && !(logsOrderID in acc)) {
          acc[logsOrderID] = [];
        }
        if (logsOrderID !== null) {
          acc[logsOrderID].push({
            ...logs.orderLogs,
          });
        }
        return acc;
      },
      {},
    );
    const query = this.db
      .select()
      .from(order)
      .leftJoin(supplier, eq(supplier.supplier_id, order.supplier_id))
      .where(isNull(order.deleted_at))
      .orderBy(
        sort === 'asc' ? asc(supplier.created_at) : desc(supplier.created_at),
      );
    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }
    const result = await query;
    const finalResult = result
      .filter((row) => {
        const orderItems: UpdateOrderItem[] =
          (orderItemsByProduct[row.order.order_id] as UpdateOrderItem[]) || [];

        // Include products based on category_id condition
        if (item_id) {
          // If category_id is specified, check if the product belongs to the category
          return orderItems.some((item) => item.item_id === item_id);
        }

        // If category_id is not specified, include all products
        return true;
      })
      .map((row) => ({
        ...row.order,
        supplier: {
          ...row.supplier,
          item_categories:
            row.supplier?.supplier_id !== undefined
              ? categoryBySupplier[row.supplier.supplier_id]
              : [],
        },
        order_item: orderItemsByOrderID[row.order.order_id],
        messages: orderLogsByOrderID[row.order.order_id],
      }));
    console.log(totalData);
    return { totalData, finalResult };
  }

  async getOrderById(paramsId: number) {
    const result = await this.db
      .select()
      .from(order)
      .where(eq(order.order_id, paramsId));
    return result[0];
  }

  async createOrder(data: CreateOrder): Promise<void> {
    return this.db.transaction(async (tx) => {
      const [inseredID] = await tx
        .insert(order)
        .values({
          supplier_id: Number(data.supplier_id),
          ordered_value: Number(data.ordered_value),
          expected_arrival: data.expected_arrival,
          status: data.status,
        })
        .returning({ order_id: order.order_id });

      if (data.order_items) {
        for (const item of data.order_items) {
          await tx.insert(orderItem).values({
            order_id: Number(inseredID.order_id),
            item_id: Number(item.item_id),
            quantity: Number(item.quantity),
            price: item.price.toString(),
            status: item.status,
          });
        }
      }
      await tx.insert(orderLogs).values({
        order_id: inseredID.order_id,
        title: 'Create Order',
        message: `Generated Orders with ${data.order_items?.length} items`,
      });
    });
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

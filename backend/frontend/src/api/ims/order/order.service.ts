import { eq, isNull, sql, asc, desc, inArray, and } from 'drizzle-orm';
import {
  category,
  order,
  orderItem,
  orderLogs,
  item,
  SchemaType,
  supplier,
  product_category,
  item_record,
  batchItems,
  serializeItems,
  variant,
} from '@/drizzle/drizzle.config';
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
    variant_id: number | undefined,
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
    // Order items
    const orderItems = await this.db
      .select()
      .from(orderItem)
      .leftJoin(variant, eq(variant.variant_id, orderItem.variant_id));
    const orderItemsByOrderID = orderItems.reduce<Record<number, unknown[]>>(
      (acc, orderItem) => {
        const orderID = orderItem.orderItem.order_id;
        if (orderID !== null && !(orderID in acc)) {
          acc[orderID] = [];
        }
        if (orderID !== null) {
          acc[orderID].push({
            ...orderItem.orderItem,
            variant: {
              ...orderItem.variant,
            },
          });
        }
        return acc;
      },
      {},
    );
    const orderItemsByProduct = orderItems.reduce<Record<number, unknown[]>>(
      (acc, orderItem) => {
        const variantId = orderItem.orderItem.variant_id;
        if (variantId !== null && !(variantId in acc)) {
          acc[variantId] = [];
        }
        if (variantId !== null) {
          acc[variantId].push({
            ...orderItem.orderItem,
            variant: {
              ...orderItem.variant,
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
        if (variant_id) {
          // If category_id is specified, check if the product belongs to the category
          return orderItems.some((item) => item.variant_id === variant_id);
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
      const [insertedOrder] = await tx
        .insert(order)
        .values({
          supplier_id: data.supplier_id,
          ordered_value: Number(data.ordered_value),
          expected_arrival: data.expected_arrival,
          status: data.status,
        })
        .returning({ order_id: order.order_id });
      for (const i of data.order_items!) {
        // Insert into orderItem
        await tx.insert(orderItem).values({
          order_id: insertedOrder.order_id,
          variant_id: i.variant_id,
          item_type: i.item_type,
          quantity: Number(i.quantity),
          price: i.price.toString(),
          status: i.status,
        });
      }
      // Log the order creation
      await tx.insert(orderLogs).values({
        order_id: insertedOrder.order_id,
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
  async checkout(order_id: number): Promise<void> {
    return this.db.transaction(async (tx) => {
      try {
        // Step 1: Fetch the order and order items
        const orderData = await tx
          .select()
          .from(order)
          .where(eq(order.order_id, order_id))
          .limit(1);

        if (!orderData) {
          throw new Error(`Order with ID ${order_id} not found`);
        }

        const orderItems = await tx
          .select()
          .from(orderItem)
          .where(eq(orderItem.order_id, order_id));

        if (orderItems.length === 0) {
          throw new Error(`No items found for order ${order_id}`);
        }

        // Step 2: Fetch existing records (items and item records)
        const existingRecords = await tx
          .select()
          .from(item_record)
          .where(eq(item_record.supplier_id, orderData[0].supplier_id!));

        const existingItems = await tx
          .select()
          .from(item)
          .where(
            inArray(
              item.item_record_id,
              existingRecords.map((rec) => rec.item_record_id),
            ),
          );

        // Step 3: Process each order item
        for (const i of orderItems) {
          const [variantData] = await tx
            .select()
            .from(variant)
            .where(eq(variant.variant_id, i.variant_id!));
          let itemRecordId = existingRecords.find(
            (rec) => rec.product_id === variantData.product_id,
          )?.item_record_id;

          // If no existing item record, create a new one
          if (!itemRecordId) {
            const [newRecord] = await tx
              .insert(item_record)
              .values({
                product_id: Number(),
                supplier_id: Number(order.supplier_id),
                ordered_qty: Number(i.quantity),
              })
              .returning({ item_record_id: item_record.item_record_id });

            itemRecordId = newRecord.item_record_id;
          }

          // Check for existing item in the `item` table
          let itemId = existingItems.find(
            (it) =>
              it.variant_id === i.variant_id &&
              it.item_record_id === itemRecordId,
          )?.item_id;

          // Create or update item in the item table
          if (!itemId) {
            // Create a new item
            const [newItem] = await tx
              .insert(item)
              .values({
                item_record_id: Number(itemRecordId),
                variant_id: Number(i.variant_id),
                ordered_qty: Number(i.quantity),
                item_type: i.item_type,
                item_status: 'On Order',
              })
              .returning({ item_id: item.item_id });

            itemId = newItem.item_id;
          } else {
            // Update existing item
            await tx
              .update(item)
              .set({
                ordered_qty:
                  (existingItems.find((it) => it.item_id === itemId)
                    ?.ordered_qty ?? 0) + Number(i.quantity),
              })
              .where(eq(item.item_id, itemId));
          }

          // Step 4: Handle Batch or Serialized Items
          if (i.item_type === 'Batch' || i.item_type === 'Both') {
            const [batchData] = await tx
              .select()
              .from(batchItems)
              .where(
                and(
                  eq(batchItems.item_id, itemId),
                  eq(batchItems.condition, 'New'),
                ),
              );

            if (batchData) {
              // Update existing batch item
              await tx.update(batchItems).set({
                status:
                  batchData.pending_quantity! - batchData.reserved_quantity! <=
                  0
                    ? 'Pending'
                    : batchData.status,
                pending_quantity:
                  (batchData.pending_quantity ?? 0) + Number(i.quantity),
              });
            } else {
              // Insert new batch item
              await tx.insert(batchItems).values({
                item_id: itemId,
                batch_number: `BATCH${Date.now()}-id${itemId}`,
                condition: 'New',
                status: 'Pending',
                pending_quantity: Number(i.quantity),
                selling_price: Number(i.price),
                unit_price: Number(i.price),
              });
            }
          } else {
            // Handle Serialized Items
            await tx.insert(serializeItems).values({
              item_id: itemId,
              serial_number: `Serial${Date.now()}-id${itemId}`,
              condition: 'New',
              status: 'Pending',
              selling_price: Number(i.price),
              unit_price: Number(i.price),
            });
          }
        }

        console.log(
          `Checkout completed successfully for order_id: ${order_id}`,
        );
      } catch (error) {
        console.error('Error during checkout:', error);
        throw error; // Ensures transaction rollback
      }
    });
  }
}

import { eq, isNull, sql, asc, desc, and, inArray } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { CreateOrder, UpdateOrder } from './order.model';
import {
  order,
  supplier,
  orderProduct,
  product,
  productDetails,
  productRecord,
  serializeProduct,
} from '@/drizzle/schema/ims';
import { SchemaType } from '@/drizzle/schema/type';

export class OrderService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }
  async getAllOrder(
    supplier_id: string | undefined,
    sort: string,
    limit: number,
    offset: number,
    includes: string[],
  ) {
    const conditions = [isNull(order.deleted_at)];

    if (supplier_id && !isNaN(Number(supplier_id))) {
      conditions.push(eq(order.supplier_id, Number(supplier_id)));
    }
    // Get total count of unique orders
    const totalCountQuery = await this.db
      .select({ count: sql<number>`COUNT(DISTINCT ${order.order_id})` })
      .from(order)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    // Get unique order IDs with pagination
    const orderIdQuery = await this.db
      .selectDistinct({
        order_id: order.order_id,
        expected_arrival: order.expected_arrival,
      })
      .from(order)
      .where(and(...conditions))
      .groupBy(order.order_id)
      .orderBy(
        sort === 'asc'
          ? asc(order.expected_arrival)
          : desc(order.expected_arrival),
      )
      .limit(limit)
      .offset(offset);

    const orderIds = orderIdQuery.map((row) => row.order_id);

    if (orderIds.length === 0) {
      return { totalData, orderWithDetails: [] }; // No data, return empty
    }
    // Fetch full order data using selected order IDs
    const query = this.db
      .select({
        order: order,
        ...(includes.includes('supplier') ? { supplier } : {}),
        ...(includes.includes('order_products')
          ? { order_product: orderProduct }
          : {}),
        ...(includes.includes('product') ? { product } : {}),
        ...(includes.includes('product_details')
          ? { product_details: productDetails }
          : {}),
      })
      .from(order)
      .where(inArray(order.order_id, orderIds));

    if (includes.includes('supplier')) {
      query.leftJoin(supplier, eq(supplier.supplier_id, order.supplier_id));
    }
    if (includes.includes('order_products')) {
      query.leftJoin(orderProduct, eq(orderProduct.order_id, order.order_id));

      if (includes.includes('product')) {
        query.leftJoin(
          product,
          eq(product.product_id, orderProduct.product_id),
        );

        if (includes.includes('product_details')) {
          query.leftJoin(
            productDetails,
            eq(productDetails.product_id, product.product_id),
          );
        }
      }
    }

    const result = await query;
    // This shit is annoying, will complain for missing data,
    // even if its intended to be undentified
    // Since its customer data and suppose not all are filled.
    const orderWithDetails: CreateOrder[] = Object.values(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result.reduce((acc: Record<number, any>, row) => {
        const orderId = Number(row.order?.order_id); // Ensure orderId is a number

        if (orderId == null || isNaN(orderId)) {
          return acc;
        }

        if (!acc[orderId]) {
          acc[orderId] = {
            ...row.order,
            supplier: includes.includes('supplier')
              ? (row.supplier ?? undefined)
              : undefined,
            order_products: [],
          };
        }

        if (includes.includes('order_products') && row.order_product) {
          acc[orderId].order_products.push({
            ...(row.order_product
              ? (row.order_product as Record<string, unknown>)
              : {}),
            product:
              includes.includes('product') && row.product
                ? {
                    ...(row.product
                      ? (row.product as Record<string, unknown>)
                      : {}),
                    product_details: includes.includes('product_details')
                      ? (row.product_details as Partial<typeof row.product>)
                      : undefined,
                  }
                : undefined,
          });
        }

        return acc;
      }, {}), // Grouping orders by ID
    );
    return { totalData, orderWithDetails };
  }

  async getOrderById(order_id: number, includes: string[]) {
    const conditions = [isNull(order.deleted_at)];

    if (order_id && !isNaN(Number(order_id))) {
      conditions.push(eq(order.order_id, Number(order_id)));
    } else {
      throw new Error('Invalid Order ID');
    }

    // Get order details
    const query = this.db
      .select({
        order: order,
        ...(includes.includes('supplier') ? { supplier } : {}),
        ...(includes.includes('order_products')
          ? { order_product: orderProduct }
          : {}),
        ...(includes.includes('product') ? { product } : {}),
        ...(includes.includes('product_details') ? { productDetails } : {}),
      })
      .from(order)
      .where(and(...conditions));

    if (includes.includes('supplier')) {
      query.leftJoin(supplier, eq(supplier.supplier_id, order.supplier_id));
    }
    if (includes.includes('order_products')) {
      query.leftJoin(orderProduct, eq(orderProduct.order_id, order.order_id));

      if (includes.includes('product')) {
        query.leftJoin(
          product,
          eq(product.product_id, orderProduct.product_id),
        );

        if (includes.includes('product_details')) {
          query.leftJoin(
            productDetails,
            eq(productDetails.product_id, product.product_id),
          );
        }
      }
    }

    const result = await query;

    if (result.length === 0) {
      return null; // No order found
    }

    const orderWithDetails = {
      ...result[0].order,
      supplier: includes.includes('supplier')
        ? (result[0].supplier ?? undefined)
        : undefined,
      order_products: includes.includes('order_products')
        ? result.map((row) => ({
            ...(row.order_product ?? {}),
            product: includes.includes('product')
              ? (row.product ?? undefined)
              : undefined,
            product_details: includes.includes('product_details')
              ? (row.productDetails ?? undefined)
              : undefined,
          }))
        : undefined,
    };

    return orderWithDetails;
  }

  async createOrder(data: CreateOrder): Promise<void> {
    return this.db.transaction(async (tx) => {
      const [insertedOrder] = await tx
        .insert(order)
        .values({
          ...data,
          order_value: data.order_value?.toString(),
          order_payment_status: 'Pending',
          order_payment_method: 'Cash',
        })
        .returning({ order_id: order.order_id });
      for (const item of data.order_products!) {
        await tx.insert(orderProduct).values({
          order_id: insertedOrder.order_id,
          ...item,
        });
      }
    });
  }
  async finalize(data: UpdateOrder, paramsId: number) {
    await this.db.transaction(async (tx) => {
      await tx
        .update(order)
        .set({
          ...data,
          order_value: data.order_value?.toString(),
        })
        .where(eq(order.order_id, paramsId));

      for (const item of data.order_products) {
        await tx
          .update(orderProduct)
          .set(item)
          .where(
            eq(orderProduct.order_product_id, Number(item.order_product_id)),
          );
        if (item.is_serialize) {
          for (let i = 0; i < item.quantity; i++) {
            await tx.insert(serializeProduct).values({
              product_id: Number(item.product_id),
              supplier_id: Number(data.supplier_id),
              price: Number(item.unit_price),
              condition: 'New',
              status: 'On Order',
              serial_number: `SN-${item.product_id}-${Date.now()}-${crypto.randomUUID().slice(0, 4)}`,
            });
          }
        } else {
          await tx.insert(productRecord).values({
            product_id: Number(item.product_id),
            supplier_id: Number(data.supplier_id),
            quantity: Number(item.quantity),
            price: Number(item.unit_price),
            condition: 'New',
            status: 'On Order',
          });
        }
      }
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

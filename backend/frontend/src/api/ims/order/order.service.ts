import { eq, isNull, sql, and, inArray } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { CreateOrder, UpdateOrder } from './order.model';
import {
  order,
  supplier,
  orderProduct,
  product,
  productDetails,
  serializeProduct,
  productRecord,
} from '@/drizzle/schema/ims';
import { SchemaType } from '@/drizzle/schema/type';
import { employee } from '@/drizzle/schema/ems';
import { ProductLog } from '@/drizzle/schema/records';
import { employeeLog } from '@/drizzle/schema/records/schema/employeeLog';
import { SupabaseService } from '@/supabase/supabase.service';
import { OrderLog } from '@/drizzle/schema/ims/schema/order/orderLog.schema';

export class OrderService {
  private db: PostgresJsDatabase<SchemaType>;
  private supabaseService: SupabaseService;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
    this.supabaseService = SupabaseService.getInstance();
  }
  async getOrdersByProductID(
    limit: number,
    offset: number,
    no_pagination: boolean,
    statuses: string[],
    product_id?: number,
    supplier_id?: number,
  ) {
    const baseQuery = this.db
      .select({
        order,
        order_product: orderProduct,
      })
      .from(order)
      .leftJoin(orderProduct, eq(orderProduct.order_id, order.order_id))
      .leftJoin(supplier, eq(supplier.supplier_id, order.supplier_id));

    const conditions = [isNull(order.deleted_at)];

    if (statuses.length === 1) {
      conditions.push(
        eq(
          order.order_status,
          statuses[0] as
            | 'Draft'
            | 'Finalized'
            | 'Awaiting Arrival'
            | 'Partially Fulfiled'
            | 'Fulfilled'
            | 'Cancelled',
        ),
      );
    } else if (statuses.length > 1) {
      conditions.push(
        inArray(
          order.order_status,
          statuses as (
            | 'Draft'
            | 'Finalized'
            | 'Awaiting Arrival'
            | 'Partially Fulfiled'
            | 'Fulfilled'
            | 'Cancelled'
          )[],
        ),
      );
    }

    if (supplier_id) {
      conditions.push(eq(supplier.supplier_id, supplier_id));
    }

    if (product_id) {
      conditions.push(eq(orderProduct.product_id, product_id));
    }

    // Total count query
    const totalCountResult = await this.db
      .select({ count: sql<number>`COUNT(DISTINCT ${order.order_id})` })
      .from(order)
      .leftJoin(orderProduct, eq(orderProduct.order_id, order.order_id))
      .leftJoin(supplier, eq(supplier.supplier_id, order.supplier_id))
      .where(and(...conditions));
    const totalData = totalCountResult[0].count;

    // Final data query
    const query = baseQuery.where(and(...conditions));
    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const orderWithDetails = result.map((row) => ({
      ...row.order,
      order_product: row.order_product,
    }));

    return { totalData, orderWithDetails };
  }

  async getAllOrder(
    sort: string,
    limit: number,
    offset: number,
    includes: string[],
    supplier_id: number | undefined,
    status: string | undefined,
  ) {
    const conditions = [isNull(order.deleted_at)];
    if (supplier_id) {
      conditions.push(eq(order.supplier_id, supplier_id));
    }
    if (status) {
      conditions.push(
        eq(
          order.order_status,
          status as
            | 'Draft'
            | 'Finalized'
            | 'Awaiting Arrival'
            | 'Partially Fulfiled'
            | 'Fulfilled'
            | 'Cancelled',
        ),
      );
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
        ...(includes.includes('order_products')
          ? { order_product: orderProduct }
          : {}),
        ...(includes.includes('supplier') ? { supplier } : {}),

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
      if (includes.includes('order_logs')) {
        query.leftJoin(
          OrderLog,
          eq(OrderLog.order_item_id, orderProduct.order_product_id),
        );
      }
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
            order_products: [],
            supplier: includes.includes('supplier')
              ? (row.supplier ?? undefined)
              : undefined,
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
      }, {}),
    ).sort((a, b) => {
      const sortDirection = sort === 'asc' ? 1 : -1;
      return (a.order_id - b.order_id) * sortDirection;
    });
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
        ...(includes.includes('order_products')
          ? { order_product: orderProduct }
          : {}),
        ...(includes.includes('supplier') ? { supplier } : {}),

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
          expected_arrival: data.expected_arrival
            ? new Date(data.expected_arrival)
            : null,
          order_payment_status: 'Pending',
          order_payment_method: 'Cash',
        })
        .returning({ order_id: order.order_id });

      const empData = await tx
        .select()
        .from(employee)
        .where(eq(employee.employee_id, data.user));

      for (const item of data.order_products!) {
        await tx.insert(orderProduct).values({
          order_id: insertedOrder.order_id,
          ...item,
          status: 'Draft' as
            | 'Draft'
            | 'Finalized'
            | 'Awaiting Arrival'
            | 'Cancelled'
            | 'Partially Delivered'
            | 'Delivered'
            | 'Returned'
            | 'Partially Stocked'
            | 'Stocked'
            | null
            | undefined,
        });
        // Logging
        await tx.insert(ProductLog).values({
          product_id: item.product_id,
          performed_by: empData[0].employee_id,
          action: `${empData[0].firstname} ${empData[0].lastname} created order with ${item.total_quantity} total quantities`,
        });
      }
      await tx.insert(employeeLog).values({
        employee_id: empData[0].employee_id,
        performed_by: empData[0].employee_id,
        action: `${empData[0].firstname} ${empData[0].lastname} created order for ${data.order_products.length} ${data.order_products.length > 1 ? 'products' : 'product'}`,
      });
    });
  }

  async updateOrder(data: UpdateOrder, paramsId: number) {
    return this.db.transaction(async (tx) => {
      await tx
        .update(order)
        .set({
          ...data,
          expected_arrival: data.expected_arrival
            ? new Date(data.expected_arrival)
            : null,
        })
        .where(eq(order.order_id, paramsId));
      // Logging
      const empData = await tx
        .select()
        .from(employee)
        .where(eq(employee.employee_id, data.user));

      await tx.insert(employeeLog).values({
        employee_id: empData[0].employee_id,
        performed_by: empData[0].employee_id,
        action: `${empData[0].firstname} ${empData[0].lastname} updated order ${paramsId}`,
      });
    });
  }

  async deleteOrder(paramsId: number, user: number): Promise<void> {
    await this.db.transaction(async (tx) => {
      await tx
        .update(order)
        .set({ deleted_at: new Date(Date.now()) })
        .where(eq(order.order_id, paramsId));

      await tx
        .update(orderProduct)
        .set({ deleted_at: new Date(Date.now()) })
        .where(eq(orderProduct.order_id, paramsId));
      // Logging
      const empData = await tx
        .select()
        .from(employee)
        .where(eq(employee.employee_id, user));

      await tx.insert(employeeLog).values({
        employee_id: empData[0].employee_id,
        performed_by: empData[0].employee_id,
        action: `${empData[0].firstname} ${empData[0].lastname} deleted order ${paramsId}`,
      });
    });
  }

  async finalize(paramsId: number, user_id: number) {
    await this.db.transaction(async (tx) => {
      await tx
        .update(order)
        .set({
          order_status: 'Awaiting Arrival',
        })
        .where(eq(order.order_id, paramsId));
      const order_products = await tx
        .select()
        .from(orderProduct)
        .where(eq(orderProduct.order_id, paramsId));

      for (const item of order_products) {
        console.log('Processing item:', item.order_product_id);
        await tx
          .update(orderProduct)
          .set({ ...item, status: 'Awaiting Arrival' })
          .where(
            eq(orderProduct.order_product_id, Number(item.order_product_id)),
          );
        console.log('Updated item:', item.order_product_id);

        await tx.insert(OrderLog).values({
          order_id: paramsId,
          product_id: item.product_id,
          order_item_id: item.order_product_id,
          total_quantity: item.total_quantity,
          ordered_quantity: item.ordered_quantity,
          status: 'Pending',
          action_type: 'Ordered',
          performed_by: user_id,
        });
        console.log('Inserted log for:', item.order_product_id);
      }

      const empData = await tx
        .select()
        .from(employee)
        .where(eq(employee.employee_id, user_id));

      await tx.insert(employeeLog).values({
        employee_id: empData[0].employee_id,
        performed_by: empData[0].employee_id,
        action: `${empData[0].firstname} ${empData[0].lastname} finalize order ${paramsId}`,
      });
    });
  }
  async pushToInventory(paramsId: number, user_id: number) {
    await this.db.transaction(async (tx) => {
      const orderData = await tx
        .update(order)
        .set({
          order_status: 'Fulfilled',
        })
        .where(eq(order.order_id, paramsId))
        .returning({ supplier_id: order.supplier_id });

      const empData = await tx
        .select()
        .from(employee)
        .where(eq(employee.employee_id, user_id));

      const order_products = await tx
        .select()
        .from(orderProduct)
        .where(eq(orderProduct.order_id, paramsId));
      for (const item of order_products!) {
        const status =
          item.ordered_quantity! == 0 ? 'Stocked' : 'Partially Stocked';
        await tx
          .update(orderProduct)
          .set({ ...item, status: status })
          .where(
            eq(orderProduct.order_product_id, Number(item.order_product_id)),
          );
        await tx.insert(productRecord).values({
          product_id: item.product_id,
          supplier_id: orderData[0].supplier_id,
          order_item_id: item.order_product_id,
          quantity: item.delivered_quantity,
          status: 'Added',
          action_type: 'Received',
          source: 'Inventory',
          handled_by: user_id,
        });
        await tx
          .update(product)
          .set({
            total_quantity: sql`${product.total_quantity} + ${item.delivered_quantity}`,
            sale_quantity: sql`${product.sale_quantity} + ${item.delivered_quantity}`,
          })
          .where(eq(product.product_id, item.product_id!));
        if (item.is_serialize) {
          const serializeRows = Array.from({
            length: item.delivered_quantity!,
          }).map(() => ({
            product_id: Number(item.product_id),
            supplier_id: orderData[0].supplier_id,
            condition: 'New' as 'New' | 'Secondhand' | 'Broken',
            status: 'Available' as
              | 'Available'
              | 'Returned'
              | 'Sold'
              | 'In Service'
              | 'On Order'
              | 'Damage'
              | 'Retired',
          }));
          await tx.insert(serializeProduct).values(serializeRows);
        }
        await tx.insert(OrderLog).values({
          order_id: item.order_id,
          order_item_id: item.order_product_id,
          product_id: item.product_id,
          total_quantity: item.total_quantity,
          ordered_quantity: item.ordered_quantity,
          delivered_quantity: item.delivered_quantity,
          resolved_quantity: item.resolved_quantity,
          status: 'Delivered',
          action_type: 'Added to inventory',
          performed_by: user_id,
        });
        await tx.insert(ProductLog).values({
          product_id: item.product_id,
          performed_by: empData[0].employee_id,
          action: `${empData[0].firstname} ${empData[0].lastname} pushed order to inventory ${item.total_quantity}`,
        });
      }

      await tx.insert(employeeLog).values({
        employee_id: empData[0].employee_id,
        performed_by: empData[0].employee_id,
        action: `${empData[0].firstname} ${empData[0].lastname} pushed to inventory ${paramsId}`,
      });
    });
  }
  async uploadOrder(paramsId: number, file: Express.Multer.File) {
    return this.db.transaction(async (tx) => {
      let filepath = undefined;
      if (file) {
        filepath = await this.supabaseService.uploadImageToBucket(file);
      }

      await tx
        .update(order)
        .set({ delivery_receipt: filepath })
        .where(eq(order.order_id, paramsId));
    });
  }
}

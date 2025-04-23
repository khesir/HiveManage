import { asc, desc, eq, isNull, sql, and } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateOrderItem, UpdateOrderItem } from './orderitem.model';
import { order, orderProduct, product, supplier } from '@/drizzle/schema/ims';
import { SchemaType } from '@/drizzle/schema/type';
import { employee } from '@/drizzle/schema/ems';
import { OrderLog } from '@/drizzle/schema/records';
import { employeeLog } from '@/drizzle/schema/records/schema/employeeLog';

export class OrderItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createOrderItem(data: CreateOrderItem) {
    await this.db.transaction(async (tx) => {
      const [newOrderProduct] = await tx
        .insert(orderProduct)
        .values({ ...data, status: 'Draft' })
        .returning({ order_product_id: orderProduct.order_product_id });

      const empData = await tx
        .select()
        .from(employee)
        .where(eq(employee.employee_id, data.user));

      const productData = await tx
        .select()
        .from(product)
        .where(eq(product.product_id, data.product_id));
      await tx.insert(OrderLog).values({
        order_id: data.order_id,
        performed_by: empData[0].employee_id,
        action: `${empData[0].firstname} ${empData[0].lastname} created orderItem ID${newOrderProduct.order_product_id}-${productData[0]?.name}`,
      });

      await tx.insert(employeeLog).values({
        employee_id: empData[0].employee_id,
        performed_by: empData[0].employee_id,
        action: `${empData[0].firstname} ${empData[0].lastname} created orderItem ID${newOrderProduct.order_product_id}-${productData[0]?.name}`,
      });
    });
  }

  async getAllOrderItem(
    order_id: string | undefined,
    product_id: string | undefined,
    sort: string,
    limit: number,
    offset: number,
    no_pagination: boolean,
  ) {
    const conditions = [isNull(orderProduct.deleted_at)];

    if (order_id) {
      conditions.push(eq(orderProduct.order_id, Number(order_id)));
    }

    if (product_id) {
      conditions.push(eq(orderProduct.product_id, Number(product_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(orderProduct)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(orderProduct)
      .leftJoin(order, eq(order.order_id, orderProduct.order_id))
      .leftJoin(product, eq(product.product_id, orderProduct.product_id))
      .leftJoin(supplier, eq(supplier.supplier_id, order.supplier_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(orderProduct.created_at)
          : desc(orderProduct.created_at),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }
    const result = await query;

    const orderitemWithDetails = result.map((row) => ({
      ...row.order_product,
      order: {
        ...row.order,
        supplier: row.supplier,
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
    await this.db.transaction(async (tx) => {
      await tx
        .update(orderProduct)
        .set({ ...data })
        .where(eq(orderProduct.order_product_id, Number(orderItem_id)));

      const empData = await tx
        .select()
        .from(employee)
        .where(eq(employee.employee_id, data.user));

      const productData = await tx
        .select()
        .from(product)
        .where(eq(product.product_id, data.product_id));
      await tx.insert(OrderLog).values({
        order_id: data.order_id,
        performed_by: empData[0].employee_id,
        action: `${empData[0].firstname} ${empData[0].lastname} updated orderItem ID${orderItem_id}-${productData[0]?.name}`,
      });

      await tx.insert(employeeLog).values({
        employee_id: empData[0].employee_id,
        performed_by: empData[0].employee_id,
        action: `${empData[0].firstname} ${empData[0].lastname} updated orderItem ID${orderItem_id}-${productData[0]?.name}`,
      });
    });
  }

  async deleteOrderItem(
    paramsId: number,
    orderId: number,
    user: number,
  ): Promise<void> {
    await this.db.transaction(async (tx) => {
      const orderItem = await tx
        .select()
        .from(orderProduct)
        .leftJoin(product, eq(product.product_id, orderProduct.product_id))
        .where(eq(orderProduct.order_product_id, paramsId));

      await tx
        .delete(orderProduct)
        .where(eq(orderProduct.order_product_id, paramsId));
      const empData = await tx
        .select()
        .from(employee)
        .where(eq(employee.employee_id, user));
      await tx.insert(OrderLog).values({
        order_id: orderId,
        performed_by: empData[0].employee_id,
        action: `${empData[0].firstname} ${empData[0].lastname} deleted orderItem ID${paramsId}-${orderItem[0].product?.name}`,
      });
      await tx.insert(employeeLog).values({
        employee_id: empData[0].employee_id,
        performed_by: empData[0].employee_id,
        action: `${empData[0].firstname} ${empData[0].lastname} deleted orderItem ID${paramsId}-${orderItem[0].product?.name}`,
      });
    });
  }

  async finalize(data: UpdateOrderItem, orderItem_id: string) {
    await this.db
      .update(orderProduct)
      .set({ ...data, status: 'Finalized' })
      .where(eq(orderProduct.order_product_id, Number(orderItem_id)));
  }
}

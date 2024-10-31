import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import {
  category,
  item,
  order,
  orderItem,
  product,
  SchemaType,
  supplier,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { UpdateOrderItem } from './orderitem.model';

export class OrderItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createOrderItem(data: object) {
    await this.db.insert(item).values(data);
  }

  async getAllOrderItem(sort: string, limit: number, offset: number) {
    const conditions = [isNull(item.deleted_at)];

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
      .leftJoin(order, eq(orderItem.orderItem_id, order.order_id))
      .leftJoin(product, eq(product.category_id, category.category_id))
      .leftJoin(supplier, eq(product.supplier_id, supplier.supplier_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(orderItem.created_at) : desc(orderItem.created_at),
      )
      .limit(limit)
      .offset(offset);

    const OrderitemsWithDetails = result.map((row) => ({
      orderItem_id: row.orderItem.orderItem_id,
      order: {
        order_id: row.order?.order_id,
        product: {
          product_id: row.product?.product_id,
          category_id: row.product?.category_id,
          name: row.product?.name,
          description: row.product?.description,
          price: row.product?.price,
          img_url: row.product?.img_url,
          created_at: row.product?.created_at,
          last_updated: row.product?.last_updated,
          deleted_at: row.product?.deleted_at,
        },
        supplier: {
          supplier_id: row.supplier?.supplier_id,
          name: row.supplier?.name,
          contact_number: row.supplier?.contact_number,
          remarks: row.supplier?.remarks,
          created_at: row.supplier?.created_at,
          last_updated: row.supplier?.last_updated,
          deleted_at: row.supplier?.deleted_at,
        },
        items_ordered: row.order?.items_ordered,
        expected_arrival: row.order?.expected_arrival,
        status: row.order?.status,
        created_at: row.order?.created_at,
        last_updated: row.order?.last_updated,
        deleted_at: row.order?.deleted_at,
      },
      quantity: row.orderItem.quantity,
      price: row.orderItem.price,
      created_at: row.orderItem.created_at,
      last_updated: row.orderItem.last_updated,
      deleted_at: row.orderItem.deleted_at,
    }));

    return { totalData, OrderitemsWithDetails };
  }

  async getOrderItemById(orderItem_id: string) {
    const result = await this.db
      .select()
      .from(orderItem)
      .leftJoin(order, eq(orderItem.orderItem_id, order.order_id))
      .leftJoin(product, eq(product.category_id, category.category_id))
      .leftJoin(supplier, eq(product.supplier_id, supplier.supplier_id))
      .where(eq(orderItem.orderItem_id, Number(orderItem_id)));

    const OrderitemsWithDetails = result.map((row) => ({
      orderItem_id: row.orderItem.orderItem_id,
      order: {
        order_id: row.order?.order_id,
        product: {
          product_id: row.product?.product_id,
          category_id: row.product?.category_id,
          name: row.product?.name,
          description: row.product?.description,
          price: row.product?.price,
          img_url: row.product?.img_url,
          created_at: row.product?.created_at,
          last_updated: row.product?.last_updated,
          deleted_at: row.product?.deleted_at,
        },
        supplier: {
          supplier_id: row.supplier?.supplier_id,
          name: row.supplier?.name,
          contact_number: row.supplier?.contact_number,
          remarks: row.supplier?.remarks,
          created_at: row.supplier?.created_at,
          last_updated: row.supplier?.last_updated,
          deleted_at: row.supplier?.deleted_at,
        },
        items_ordered: row.order?.items_ordered,
        expected_arrival: row.order?.expected_arrival,
        status: row.order?.status,
        created_at: row.order?.created_at,
        last_updated: row.order?.last_updated,
        deleted_at: row.order?.deleted_at,
      },
      quantity: row.orderItem.quantity,
      price: row.orderItem.price,
      created_at: row.orderItem.created_at,
      last_updated: row.orderItem.last_updated,
      deleted_at: row.orderItem.deleted_at,
    }));

    return OrderitemsWithDetails;
  }

  async updateOrderItem(data: UpdateOrderItem, orderItem_id: string) {
    // Convert price to a string with two decimal places
    const updatedData = {
      ...data,
      price: data.price.toFixed(2), // Ensure price is a string formatted as a decimal
    };

    await this.db
      .update(orderItem)
      .set(updatedData)
      .where(eq(orderItem.orderItem_id, Number(orderItem_id)));
  }

  async deleteOrderItem(paramsId: number): Promise<void> {
    await this.db
      .update(orderItem)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(orderItem.orderItem_id, paramsId));
  }
}

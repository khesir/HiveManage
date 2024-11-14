import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import {
  category,
  order,
  orderItem,
  product,
  product_category,
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
    await this.db.insert(orderItem).values(data);
  }

  async getAllOrderItem(sort: string, limit: number, offset: number) {
    const conditions = [isNull(orderItem.deleted_at)];

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(orderItem)
      .where(and(...conditions));

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
      .leftJoin(supplier, eq(supplier.supplier_id, orderItem.supplier_id))
      .leftJoin(product, eq(product.product_id, orderItem.product_id))
      .where(and(...conditions))
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
        categories: categoryByProduct[row.product!.product_id],
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
      .leftJoin(supplier, eq(supplier.supplier_id, orderItem.supplier_id))
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
      supplier: {
        supplier_id: row.supplier?.supplier_id,
        name: row.supplier?.name,
        contact_number: row.supplier?.contact_number,
        remarks: row.supplier?.remarks,
        created_at: row.supplier?.created_at,
        last_updated: row.supplier?.last_updated,
        deleted_at: row.supplier?.deleted_at,
      },
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

import { eq, isNull, sql, asc, desc, and } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { CreateOrder } from './order.model';
import { order, orderItem, supplier } from '@/drizzle/schema/ims';
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
  ) {
    const conditions = [isNull(order.deleted_at)];

    if (supplier_id) {
      conditions.push(eq(order.supplier_id, Number(supplier_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(order)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(order)
      .leftJoin(supplier, eq(supplier.supplier_id, order.supplier_id))
      .where(and(...conditions))
      .orderBy(sort === 'asc' ? asc(order.created_at) : desc(order.created_at))
      .limit(limit)
      .offset(offset);

    const orderWithDetails = result.map((row) => ({
      ...row.order,
      supplier: {
        ...row.supplier,
      },
    }));
    return { totalData, orderWithDetails };
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
          status: i.status,
          quantity: Number(i.quantity),
          price: i.price.toString(),
        });
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

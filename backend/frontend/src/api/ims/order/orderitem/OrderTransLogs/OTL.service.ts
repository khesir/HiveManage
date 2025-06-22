import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { SchemaType } from '@/drizzle/schema/type';
import { employee } from '@/drizzle/schema/ems';
import { CreateOrderTransactionLog } from './OTL.model';
import { orderProduct } from '@/drizzle/schema/ims';
import { OrderLog } from '@/drizzle/schema/ims/schema/order/orderLog.schema';

export class OrderTransactionLogService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createOrderTransactionLog(data: CreateOrderTransactionLog) {
    await this.db.insert(OrderLog).values({
      ...data,
      resolve_type:
        data.resolve_type !== undefined &&
        ['Refunded', 'Cancelled', 'Replaced', 'Discounted'].includes(
          data.resolve_type,
        )
          ? data.resolve_type
          : null,
    });
  }

  async getAllOrderTransactionLog(
    order_id: string | undefined,
    order_item_id: string | undefined,
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(OrderLog.deleted_at)];

    if (order_id) {
      conditions.push(eq(OrderLog.order_id, Number(order_id)));
    }
    if (order_item_id) {
      conditions.push(eq(OrderLog.order_item_id, Number(order_item_id)));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(OrderLog)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(OrderLog)
      .leftJoin(employee, eq(employee.employee_id, OrderLog.performed_by))
      .leftJoin(
        orderProduct,
        eq(orderProduct.order_product_id, OrderLog.order_item_id),
      )
      .where(and(...conditions))
      .orderBy(
        sort === 'desc' ? asc(OrderLog.created_at) : desc(OrderLog.created_at),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const ordertranslogWithDetails = result.map((row) => ({
      ...row.order_log,
      order_item: row.order_product,
      performed_by: {
        ...row.employee,
      },
    }));

    return { totalData, ordertranslogWithDetails };
  }
}

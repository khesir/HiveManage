import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { SchemaType } from '@/drizzle/schema/type';
import { employee } from '@/drizzle/schema/ems';
import { order, orderProduct } from '@/drizzle/schema/ims';
import { OrderTransLog } from '@/drizzle/schema/records';

export class OrderTransactionLogService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createOrderTransactionLog(data: object) {
    await this.db.insert(OrderTransLog).values(data);
  }

  async getAllOrderTransactionLog(
    order_id: string | undefined,
    order_item_id: string | undefined,
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(OrderTransLog.deleted_at)];

    if (order_id) {
      conditions.push(eq(OrderTransLog.order_id, Number(order_id)));
    }
    if (order_item_id) {
      conditions.push(eq(OrderTransLog.order_item_id, Number(order_item_id)));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(OrderTransLog)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(OrderTransLog)
      .leftJoin(order, eq(order.order_id, OrderTransLog.order_id))
      .leftJoin(
        orderProduct,
        eq(orderProduct.order_product_id, OrderTransLog.order_item_id),
      )
      .leftJoin(employee, eq(employee.employee_id, OrderTransLog.performed_by))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(OrderTransLog.created_at)
          : desc(OrderTransLog.created_at),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const ordertranslogWithDetails = result.map((row) => ({
      ...row.OrderTransLog,
      order: {
        ...row.order,
      },
      orderProduct: {
        row,
      },
      employee: {
        ...row.employee,
      },
    }));

    return { totalData, ordertranslogWithDetails };
  }
}

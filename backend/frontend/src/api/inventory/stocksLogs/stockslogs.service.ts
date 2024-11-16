import {
  category,
  employee,
  position,
  product,
  product_category,
  SchemaType,
  stocksLogs,
} from '@/drizzle/drizzle.schema';
import { eq, sql, asc, and, desc, isNull } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class StocksLogsService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async getAllStocksLogs(
    sort: string | undefined,
    limit: number,
    offset: number,
    product_id: string | undefined,
    no_pagination: boolean,
  ) {
    const conditions = [];

    if (product_id) {
      conditions.push(eq(stocksLogs.product_id, Number(product_id)));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(stocksLogs);

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
      const productID = product_category.product_category.product_id;
      if (productID !== null && !(productID in acc)) {
        acc[productID] = [];
      }
      if (productID !== null) {
        acc[productID].push({
          ...product_category.product_category,
          category: { ...product_category.category },
        });
      }
      return acc;
    }, {});

    const query = this.db
      .select()
      .from(stocksLogs)
      .leftJoin(product, eq(product.product_id, stocksLogs.product_id))
      .leftJoin(employee, eq(employee.employee_id, stocksLogs.employee_id))
      .leftJoin(position, eq(employee.position_id, position.position_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(stocksLogs.created_at)
          : desc(stocksLogs.created_at),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }
    const result = await query;
    const itemsWithDetails = result.map((row) => ({
      ...row.stock_logs,
      product: {
        ...row.product,
        categories: categoryByProduct[row.product!.product_id],
      },
      employee: {
        ...row.employee,
        position: {
          ...row.position,
        },
      },
    }));

    return {
      totalData,
      itemsWithDetails,
    };
  }

  async getStockLogByID(stock_id: string) {
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
      const productID = product_category.product_category?.category_id;
      if (productID !== null && !(productID in acc)) {
        acc[productID] = [];
      }
      if (productID !== null) {
        acc[productID].push({
          ...product_category.product_category,
          category: { ...product_category.product_category },
        });
      }
      return acc;
    }, {});
    const result = await this.db
      .select()
      .from(stocksLogs)
      .leftJoin(product, eq(product.product_id, stocksLogs.product_id))
      .leftJoin(employee, eq(employee.employee_id, stocksLogs.employee_id))
      .leftJoin(position, eq(employee.position_id, position.position_id))
      .where(eq(stocksLogs.stock_log_id, Number(stock_id)));

    const itemsWithDetails = result.map((row) => ({
      ...row.stock_logs,
      product: {
        ...row.product,
        categories: categoryByProduct[row.product!.product_id],
      },
      employee: {
        ...row.employee,
        position: {
          ...row.position,
        },
      },
    }));

    return itemsWithDetails;
  }
}

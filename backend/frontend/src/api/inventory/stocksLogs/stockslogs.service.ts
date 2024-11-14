import {
  category,
  product,
  product_category,
  SchemaType,
  stocksLogs,
} from '@/drizzle/drizzle.schema';
import { eq, sql, asc, desc, isNull } from 'drizzle-orm';
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
  ) {
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
      .from(stocksLogs)
      .leftJoin(product, eq(product.product_id, stocksLogs.product_id))
      .orderBy(
        sort === 'asc'
          ? asc(stocksLogs.created_at)
          : desc(stocksLogs.created_at),
      )
      .limit(limit)
      .offset(offset);

    const itemsWithDetails = result.map((row) => ({
      ...row.stock_logs,
      product: {
        ...row.product,
        categories: categoryByProduct[row.product!.product_id],
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
      .from(stocksLogs)
      .leftJoin(product, eq(product.product_id, stocksLogs.product_id))
      .where(eq(stocksLogs.stock_log_id, Number(stock_id)));
    const itemsWithDetails = result.map((row) => ({
      ...row.stock_logs,
      product: {
        ...row.product,
        categories: categoryByProduct[row.product!.product_id],
      },
    }));

    return itemsWithDetails;
  }
}

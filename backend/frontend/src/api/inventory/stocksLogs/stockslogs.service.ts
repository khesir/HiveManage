import {
  category,
  item,
  product,
  SchemaType,
  stocksLogs,
  supplier,
} from '@/drizzle/drizzle.schema';
import { eq, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class StocksLogsService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async getAllStocksLogs(limit: number, offest: number, sort: string) {
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(stocksLogs);

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(stocksLogs)
      .leftJoin(item, eq(item.item_id, stocksLogs.item_id))
      .leftJoin(product, eq(product.product_id, item.product_id))
      .leftJoin(supplier, eq(product.supplier_id, supplier.supplier_id))
      .leftJoin(category, eq(category.category_id, product.category_id))
      .orderBy(
        sort === 'asc'
          ? asc(stocksLogs.created_at)
          : desc(stocksLogs.created_at),
      )
      .limit(limit)
      .offset(offest);

    const itemsWithDetails = result.map((row) => ({
      stock_log_id: row.stock_logs.stock_log_id,
      item: {
        item_id: row.item?.item_id,
        product: {
          product_id: row.product?.product_id,
          category: {
            category_id: row.category?.category_id,
            name: row.category?.name,
            content: row.category?.content,
            created_at: row.category?.created_at,
            last_updated: row.category?.last_updated,
            deleted_at: row.category?.deleted_at,
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
          name: row.product?.name,
          description: row.product?.description,
          price: row.product?.price,
          img_url: row.product?.img_url,
          created_at: row.product?.created_at,
          last_updated: row.product?.last_updated,
          deleted_at: row.product?.deleted_at,
        },
      },
      quantity: row.stock_logs.quantity,
      movement_type: row.stock_logs.movement_type,
      action: row.stock_logs.action,
      created_at: row.stock_logs.created_at,
    }));

    return {
      totalData,
      itemsWithDetails,
    };
  }

  async getStockLogByID(stock_id: string) {
    const result = await this.db
      .select()
      .from(stocksLogs)
      .leftJoin(item, eq(item.item_id, stocksLogs.item_id))
      .leftJoin(product, eq(product.product_id, item.product_id))
      .leftJoin(supplier, eq(product.supplier_id, supplier.supplier_id))
      .leftJoin(category, eq(category.category_id, product.category_id))
      .where(eq(stocksLogs.stock_log_id, Number(stock_id)));
    console.log(result);
    const itemsWithDetails = result.map((row) => ({
      stock_log_id: row.stock_logs.stock_log_id,
      item: {
        item_id: row.item?.item_id,
        product: {
          product_id: row.product?.product_id,
          category: {
            category_id: row.category?.category_id,
            name: row.category?.name,
            content: row.category?.content,
            created_at: row.category?.created_at,
            last_updated: row.category?.last_updated,
            deleted_at: row.category?.deleted_at,
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
          name: row.product?.name,
          description: row.product?.description,
          price: row.product?.price,
          img_url: row.product?.img_url,
          created_at: row.product?.created_at,
          last_updated: row.product?.last_updated,
          deleted_at: row.product?.deleted_at,
        },
        stock: row.item?.stock,
        tag: row.item?.tag,
        re_order_level: row.item?.re_order_level,
        created_at: row.item?.created_at,
        last_updated: row.item?.last_updated,
        deleted_at: row.item?.deleted_at,
      },
      quantity: row.stock_logs.quantity,
      movement_type: row.stock_logs.movement_type,
      action: row.stock_logs.action,
      created_at: row.stock_logs.created_at,
    }));

    return itemsWithDetails;
  }
}

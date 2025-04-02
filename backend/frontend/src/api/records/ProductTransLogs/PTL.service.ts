import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { SchemaType } from '@/drizzle/schema/type';
import { product, productRecord, serializeProduct } from '@/drizzle/schema/ims';
import { ProductTransLog } from '@/drizzle/schema/logs';

export class ProductTransactionLogService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createProductTransactionLog(data: object) {
    await this.db.insert(ProductTransLog).values(data);
  }

  async getAllProductTransactionLog(
    product_id: string | undefined,
    product_record_id: string | undefined,
    serial_id: string,
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(ProductTransLog.deleted_at)];

    if (product_id) {
      conditions.push(eq(ProductTransLog.product_id, Number(product_id)));
    }
    if (product_record_id) {
      conditions.push(
        eq(ProductTransLog.product_record_id, Number(product_record_id)),
      );
    }
    if (serial_id) {
      conditions.push(eq(ProductTransLog.serial_id, Number(serial_id)));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(ProductTransLog)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(ProductTransLog)
      .leftJoin(product, eq(product.product_id, ProductTransLog.product_id))
      .leftJoin(
        productRecord,
        eq(productRecord.product_record_id, ProductTransLog.product_record_id),
      )
      .leftJoin(
        serializeProduct,
        eq(serializeProduct.serial_id, ProductTransLog.serial_id),
      )
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(ProductTransLog.created_at)
          : desc(ProductTransLog.created_at),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const producttranslogWithDetails = result.map((row) => ({
      ...row.ProductTransLog,
      product: {
        ...row.product,
      },
      productRecord: {
        ...row.product_record,
      },
      serializedProduct: {
        ...row.serialized_product,
      },
    }));

    return { totalData, producttranslogWithDetails };
  }
}

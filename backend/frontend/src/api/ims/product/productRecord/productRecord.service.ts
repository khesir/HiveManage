import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { product, productRecord, supplier } from '@/drizzle/schema/ims';
import { SchemaType } from '@/drizzle/schema/type';
import { CreateProductRecord } from './productRecord.model';

export class ProductRecordService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createProductRecord(data: CreateProductRecord) {
    await this.db.insert(productRecord).values(data);
  }
  async getAllItemRecord(
    product_id: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(productRecord.deleted_at)];

    if (product_id) {
      conditions.push(eq(productRecord.product_id, Number(product_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(productRecord)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(productRecord)
      .leftJoin(product, eq(product.product_id, productRecord.product_id))
      .leftJoin(supplier, eq(supplier.supplier_id, productRecord.supplier_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(productRecord.created_at)
          : desc(productRecord.created_at),
      )
      .limit(limit)
      .offset(offset);

    const itemrecordWithDetails = result.map((row) => ({
      ...row.product_record,
      product: {
        ...row.product,
      },
      supplier: {
        ...row.supplier,
      },
    }));
    console.log(itemrecordWithDetails);
    return { totalData, itemrecordWithDetails };
  }

  async getItemRecordByID(product_record_id: string) {
    const result = await this.db
      .select()
      .from(productRecord)
      .leftJoin(product, eq(product.product_id, productRecord.product_id))
      .leftJoin(supplier, eq(supplier.supplier_id, productRecord.supplier_id))
      .where(eq(productRecord.product_record_id, Number(product_record_id)));

    const itemrecordWithDetails = result.map((row) => ({
      ...row.product_record,
      product: {
        ...row.product,
      },

      supplier: {
        ...row.supplier,
      },
    }));

    return itemrecordWithDetails;
  }

  async updateItemRecord(data: object, paramsId: number) {
    await this.db
      .update(productRecord)
      .set(data)
      .where(eq(productRecord.product_record_id, paramsId));
  }

  async deleteItemRecord(paramsId: number): Promise<void> {
    await this.db
      .update(productRecord)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(productRecord.product_record_id, paramsId));
  }
}

import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { SchemaType } from '@/drizzle/schema/type';
import { ProductLog } from '@/drizzle/schema/records';
import { employee } from '@/drizzle/schema/ems';

export class ProductTransactionLogService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createProductTransactionLog(data: object) {
    await this.db.insert(ProductLog).values(data);
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
    const conditions = [isNull(ProductLog.deleted_at)];

    if (product_id) {
      conditions.push(eq(ProductLog.product_id, Number(product_id)));
    }
    if (product_record_id) {
      conditions.push(
        eq(ProductLog.product_record_id, Number(product_record_id)),
      );
    }
    if (serial_id) {
      conditions.push(eq(ProductLog.serial_id, Number(serial_id)));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(ProductLog)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(ProductLog)
      .leftJoin(employee, eq(employee.employee_id, ProductLog.performed_by))
      .where(and(...conditions))
      .orderBy(
        sort === 'desc'
          ? asc(ProductLog.created_at)
          : desc(ProductLog.created_at),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const producttranslogWithDetails = result.map((row) => ({
      ...row.ProductTransLog,
      performed_by: row.employee,
    }));

    return { totalData, producttranslogWithDetails };
  }
}

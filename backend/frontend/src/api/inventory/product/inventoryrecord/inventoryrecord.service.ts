import {
  item_record,
  product,
  SchemaType,
  supplier,
} from '@/drizzle/drizzle.schema';
import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateInventoryRecord } from './inventoryrecord.model';

export class InventoryRecordService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createInventoryRecord(data: CreateInventoryRecord) {
    await this.db.insert(item_record).values(data);
  }

  async getAllInventoryRecord(
    product_id: string | undefined,
    condition: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(item_record.deleted_at)];

    if (condition) {
      // Define valid statuses as a string union type
      const validStatuses = [
        'Active',
        'Inactive',
        'Pending Approval',
        'Verified',
        'Unverified',
        'Suspended',
        'Preferred',
        'Blacklisted',
        'Under Review',
        'Archived',
      ] as const; // 'as const' infers a readonly tuple of strings
      if (validStatuses.includes(condition as (typeof validStatuses)[number])) {
        conditions.push(
          eq(
            item_record.condition,
            condition as (typeof validStatuses)[number],
          ),
        );
      } else {
        throw new Error(`Invalid payment status: ${condition}`);
      }
    }
    if (product_id) {
      conditions.push(eq(item_record.product_id, Number(product_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(item_record)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(item_record)
      .leftJoin(supplier, eq(supplier.supplier_id, item_record.supplier_id))
      .leftJoin(product, eq(product.product_id, item_record.product_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(item_record.created_at)
          : desc(item_record.created_at),
      )
      .limit(limit)
      .offset(offset);

    const inventoryrecordWithDetails = result.map((row) => ({
      ...row.item_record,
      supplier: {
        ...row.supplier,
      },
      product: {
        ...row.product,
      },
    }));
    return { totalData, inventoryrecordWithDetails };
  }

  async getInventoryRecordByID(item_record_id: string) {
    const result = await this.db
      .select()
      .from(item_record)
      .leftJoin(supplier, eq(supplier.supplier_id, item_record.supplier_id))
      .leftJoin(product, eq(product.product_id, item_record.product_id))
      .where(eq(item_record.item_record_id, Number(item_record_id)));

    const inventoryrecordWithDetails = result.map((row) => ({
      ...row.item_record,
      supplier: {
        ...row.supplier,
      },
      product: {
        ...row.product,
      },
    }));

    return inventoryrecordWithDetails;
  }

  async updateInventoryRecord(data: object, paramsId: number) {
    await this.db
      .update(item_record)
      .set(data)
      .where(eq(item_record.item_record_id, paramsId));
  }

  async deleteInventoryRecord(paramsId: number): Promise<void> {
    await this.db
      .update(item_record)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(item_record.item_record_id, paramsId));
  }
}

import {
  item,
  inventory_record,
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
    await this.db.insert(inventory_record).values(data);
  }

  async getAllInventoryRecord(
    item_id: string | undefined,
    tag: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(inventory_record.deleted_at)];

    if (tag) {
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
      if (validStatuses.includes(tag as (typeof validStatuses)[number])) {
        conditions.push(
          eq(inventory_record.tag, tag as (typeof validStatuses)[number]),
        );
      } else {
        throw new Error(`Invalid payment status: ${tag}`);
      }
    }
    if (item_id) {
      conditions.push(eq(inventory_record.item_id, Number(item_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(inventory_record)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(inventory_record)
      .leftJoin(
        supplier,
        eq(supplier.supplier_id, inventory_record.supplier_id),
      )
      .leftJoin(item, eq(item.item_id, inventory_record.item_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(inventory_record.created_at)
          : desc(inventory_record.created_at),
      )
      .limit(limit)
      .offset(offset);

    const inventoryrecordWithDetails = result.map((row) => ({
      inventory_record_id: row.inventory_record.inventory_record_id,
      supplier: {
        supplier_id: row.supplier?.supplier_id,
        name: row.supplier?.name,
        contact_number: row.supplier?.contact_number,
        remarks: row.supplier?.remarks,
        created_at: row.supplier?.created_at,
        last_updated: row.supplier?.last_updated,
        deleted_at: row.supplier?.deleted_at,
      },
      item: {
        item_id: row.item?.item_id,
        product_id: row.item?.product_id,
        stock: row.item?.stock,
        price: row.item?.price,
        on_listing: row.item?.on_listing,
        re_order_level: row.item?.re_order_level,
        tag: row.item?.tag,
        created_at: row.item?.created_at,
        last_updated: row.item?.last_updated,
        deleted_at: row.item?.deleted_at,
      },
      tag: row.inventory_record?.tag,
      stock: row.inventory_record?.stock,
      created_at: row.inventory_record?.created_at,
      last_updated: row.inventory_record?.last_updated,
      deleted_at: row.inventory_record?.deleted_at,
    }));

    return { totalData, inventoryrecordWithDetails };
  }

  async getInventoryRecordByID(item_supplier_id: string) {
    const result = await this.db
      .select()
      .from(inventory_record)
      .leftJoin(
        supplier,
        eq(supplier.supplier_id, inventory_record.supplier_id),
      )
      .leftJoin(item, eq(item.item_id, inventory_record.item_id))
      .where(
        eq(inventory_record.inventory_record_id, Number(item_supplier_id)),
      );

    const inventoryrecordWithDetails = result.map((row) => ({
      inventory_record_id: row.inventory_record.inventory_record_id,
      supplier: {
        supplier_id: row.supplier?.supplier_id,
        name: row.supplier?.name,
        contact_number: row.supplier?.contact_number,
        remarks: row.supplier?.remarks,
        created_at: row.supplier?.created_at,
        last_updated: row.supplier?.last_updated,
        deleted_at: row.supplier?.deleted_at,
      },
      item: {
        item_id: row.item?.item_id,
        product_id: row.item?.product_id,
        stock: row.item?.stock,
        price: row.item?.price,
        on_listing: row.item?.on_listing,
        re_order_level: row.item?.re_order_level,
        tag: row.item?.tag,
        created_at: row.item?.created_at,
        last_updated: row.item?.last_updated,
        deleted_at: row.item?.deleted_at,
      },
      tag: row.inventory_record?.tag,
      stock: row.inventory_record?.stock,
      created_at: row.inventory_record?.created_at,
      last_updated: row.inventory_record?.last_updated,
      deleted_at: row.inventory_record?.deleted_at,
    }));

    return inventoryrecordWithDetails;
  }

  async updateInventoryRecord(data: object, paramsId: number) {
    await this.db
      .update(inventory_record)
      .set(data)
      .where(eq(inventory_record.inventory_record_id, paramsId));
  }

  async deleteInventoryRecord(paramsId: number): Promise<void> {
    await this.db
      .update(inventory_record)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(inventory_record.inventory_record_id, paramsId));
  }
}

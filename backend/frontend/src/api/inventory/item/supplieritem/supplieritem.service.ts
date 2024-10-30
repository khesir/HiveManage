import {
  item,
  item_supplier,
  SchemaType,
  supplier,
} from '@/drizzle/drizzle.schema';
import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateSupplierItem } from './supplieritem.model';

export class SupplierItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createSupplierItem(data: CreateSupplierItem) {
    await this.db.insert(item_supplier).values(data);
  }

  async getAllSupplierItem(
    item_id: string | undefined,
    tag: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(item_supplier.deleted_at)];

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
          eq(item_supplier.tag, tag as (typeof validStatuses)[number]),
        );
      } else {
        throw new Error(`Invalid payment status: ${tag}`);
      }
    }
    if (item_id) {
      conditions.push(eq(item_supplier.item_id, Number(item_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(item_supplier)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(item_supplier)
      .leftJoin(supplier, eq(supplier.supplier_id, item_supplier.supplier_id))
      .leftJoin(item, eq(item.item_id, item_supplier.item_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(item_supplier.created_at)
          : desc(item_supplier.created_at),
      )
      .limit(limit)
      .offset(offset);

    const supplieritemWithDetails = result.map((row) => ({
      item_supplier_id: row.item_supplier.item_supplier_id,
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
      tag: row.item_supplier?.tag,
      stock: row.item_supplier?.stock,
      created_at: row.item_supplier?.created_at,
      last_updated: row.item_supplier?.last_updated,
      deleted_at: row.item_supplier?.deleted_at,
    }));

    return { totalData, supplieritemWithDetails };
  }

  async getSupplierItemByID(item_supplier_id: string) {
    const result = await this.db
      .select()
      .from(item_supplier)
      .leftJoin(supplier, eq(supplier.supplier_id, item_supplier.supplier_id))
      .leftJoin(item, eq(item.item_id, item_supplier.item_id))
      .where(eq(item_supplier.item_supplier_id, Number(item_supplier_id)));

    const supplieritemWithDetails = result.map((row) => ({
      item_supplier_id: row.item_supplier.item_supplier_id,
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
      tag: row.item_supplier?.tag,
      stock: row.item_supplier?.stock,
      created_at: row.item_supplier?.created_at,
      last_updated: row.item_supplier?.last_updated,
      deleted_at: row.item_supplier?.deleted_at,
    }));

    return supplieritemWithDetails;
  }

  async updateSupplierItem(data: object, paramsId: number) {
    await this.db
      .update(item_supplier)
      .set(data)
      .where(eq(item_supplier.item_supplier_id, paramsId));
  }

  async deleteSupplierItem(paramsId: number): Promise<void> {
    await this.db
      .update(item_supplier)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(item_supplier.item_supplier_id, paramsId));
  }
}

import {
  batchItems,
  item,
  item_record,
  product,
  SchemaType,
  serializeItems,
  supplier,
} from '@/drizzle/drizzle.schema';
import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateItemRecord } from './itemrecord.model';

export class ItemRecordService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createItemRecord(data: CreateItemRecord, product_id: string) {
    return this.db.transaction(async (tx) => {
      console.log(product_id);
      console.log(data);
      // Fetch Product data and update totalstock
      const [productData] = await tx
        .select()
        .from(product)
        .where(eq(product.product_id, Number(product_id)));

      await tx
        .update(product)
        .set({ total_stock: (productData.total_stock ?? 0) + data.total_stock })
        .where(eq(product.product_id, Number(product_id)));
      // Create Record
      const [newItemRecord] = await tx
        .insert(item_record)
        .values({
          product_id: Number(product_id),
          supplier_id: data.supplier_id,
          total_stock: data.total_stock,
        })
        .returning({ item_record_id: item_record.item_record_id });

      // Create Item
      if (data.item) {
        const [newItem] = await tx
          .insert(item)
          .values({
            item_record_id: newItemRecord.item_record_id,
            item_type: data.item.item_type,
            item_status: data.item.item_status,
            quantity: data.item.quantity,
            reorder_level: data.item.reorder_level,
          })
          .returning({ item_id: item.item_id });
        // Iterate and create each batch Items and serialize_items
        if (data.item.serialize_items && data.item.serialize_items.length > 0) {
          const itemData = data.item.serialize_items.map((serialize) => ({
            item_id: newItem.item_id,
            serial_number: serialize.serial_number,
            condition: serialize.item_condition,
            status: serialize.item_status,
            unit_price: serialize.unit_price,
            selling_price: serialize.selling_price,
            warranty_expiry_date: serialize.warranty_expiry_date,
          }));

          await tx.insert(serializeItems).values(itemData);
        }
        if (data.item.batch_items && data.item.batch_items.length > 0) {
          const itemData = data.item.batch_items.map((batch) => ({
            item_id: newItem.item_id,
            batch_number: batch.batch_number,
            condition: batch.item_condition,
            status: batch.item_status,
            unit_price: batch.unit_price,
            selling_price: batch.selling_price,
            quantity: batch.quantity,
            reserved_quantity: batch.reserved_quantity,
            production_date: batch.production_date,
            expiration_date: batch.expiration_date,
          }));

          await tx.insert(batchItems).values(itemData);
        }
      }
    });
  }

  async getAllItemRecord(
    product_id: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(item_record.deleted_at)];

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

    const itemrecordWithDetails = result.map((row) => ({
      ...row.item_record,
      supplier: {
        ...row.supplier,
      },
      product: {
        ...row.product,
      },
    }));
    return { totalData, itemrecordWithDetails };
  }

  async getItemRecordByID(item_record_id: string) {
    const result = await this.db
      .select()
      .from(item_record)
      .leftJoin(supplier, eq(supplier.supplier_id, item_record.supplier_id))
      .leftJoin(product, eq(product.product_id, item_record.product_id))
      .where(eq(item_record.item_record_id, Number(item_record_id)));

    const itemrecordWithDetails = result.map((row) => ({
      ...row.item_record,
      supplier: {
        ...row.supplier,
      },
      product: {
        ...row.product,
      },
    }));

    return itemrecordWithDetails;
  }

  async updateItemRecord(data: object, paramsId: number) {
    await this.db
      .update(item_record)
      .set(data)
      .where(eq(item_record.item_record_id, paramsId));
  }

  async deleteItemRecord(paramsId: number): Promise<void> {
    await this.db
      .update(item_record)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(item_record.item_record_id, paramsId));
  }
}

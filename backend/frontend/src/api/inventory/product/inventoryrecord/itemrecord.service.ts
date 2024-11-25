import {
  item,
  item_record,
  product,
  SchemaType,
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
      // Fetch existing record
      console.log(product_id);
      console.log(data);
      const [relatedData] = await tx
        .select()
        .from(item_record)
        .where(
          and(
            eq(item_record.supplier_id, data.supplier_id),
            eq(item_record.product_id, Number(product_id)),
          ),
        );

      // Update existing record or create a new one
      let itemRecordId: number;
      console.log(relatedData);
      if (relatedData) {
        // Update total stock in `item_record`
        await tx
          .update(item_record)
          .set({
            total_stock: (relatedData.total_stock ?? 0) + data.total_stock,
          })
          .where(eq(item_record.item_record_id, relatedData.item_record_id));

        itemRecordId = relatedData.item_record_id;
      } else {
        // Create new `item_record`
        const [newData] = await tx
          .insert(item_record)
          .values({
            supplier_id: data.supplier_id,
            product_id: Number(product_id),
            total_stock: data.total_stock,
          })
          .returning({ item_record_id: item_record.item_record_id });

        itemRecordId = newData.item_record_id;
      }

      // Update product total stock
      const [existingProduct] = await tx
        .select()
        .from(product)
        .where(eq(product.product_id, Number(product_id)));

      await tx
        .update(product)
        .set({
          total_stock: (existingProduct?.total_stock ?? 0) + data.total_stock,
        })
        .where(eq(product.product_id, Number(product_id)));

      // Insert items into `item` table
      if (data.item) {
        const itemRecords = data.item.map((itemData) => ({
          ...itemData,
          item_record_id: itemRecordId,
          unit_price: itemData.unit_price.toString(),
          selling_price: itemData.selling_price.toString(),
        }));

        await tx.insert(item).values(itemRecords);
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

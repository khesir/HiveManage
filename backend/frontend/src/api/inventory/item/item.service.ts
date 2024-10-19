import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { category, item, product, supplier } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateItem, UpdateItem } from './item.model';

export class ItemService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createItem(data: CreateItem) {
    await this.db.insert(item).values(data);
  }

  async getAllItem(
    on_lisitng: string,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(item.deleted_at)];

    if (on_lisitng) {
      conditions.push(eq(item.on_listing, Boolean(on_lisitng)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(item)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(item)
      .leftJoin(product, eq(item.product_id, product.product_id))
      .leftJoin(category, eq(product.category_id, category.category_id))
      .leftJoin(supplier, eq(product.supplier_id, supplier.supplier_id))
      .where(and(...conditions))
      .orderBy(sort === 'asc' ? asc(item.created_at) : desc(item.created_at))
      .limit(limit)
      .offset(offset);

    const itemsWithDetails = result.map((row) => ({
      item_id: row.item.item_id,
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
        img_url: row.product?.img_url,
        description: row.product?.description,
        price: row.product?.price,
        created_at: row.product?.created_at,
        last_updated: row.product?.last_updated,
        deleted_at: row.product?.deleted_at,
      },
      stock: row.item.stock,
      on_listing: row.item.on_listing,
      tag: row.item.tag,
      re_order_level: row.item.re_order_level,
      created_at: row.item.created_at,
      last_updated: row.item.last_updated,
      deleted_at: row.item.deleted_at,
    }));

    return { totalData, itemsWithDetails };
  }

  async getItemById(item_id: string) {
    const result = await this.db
      .select()
      .from(item)
      .leftJoin(product, eq(item.product_id, product.product_id))
      .leftJoin(category, eq(product.category_id, category.category_id))
      .leftJoin(supplier, eq(product.supplier_id, supplier.supplier_id))
      .where(eq(item.item_id, Number(item_id)));

    const itemsWithDetails = result.map((row) => ({
      item_id: row.item.item_id,
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
        img_url: row.product?.img_url,
        description: row.product?.description,
        price: row.product?.price,
        created_at: row.product?.created_at,
        last_updated: row.product?.last_updated,
        deleted_at: row.product?.deleted_at,
      },
      stock: row.item.stock,
      tag: row.item.tag,
      re_order_level: row.item.re_order_level,
      created_at: row.item.created_at,
      last_updated: row.item.last_updated,
      deleted_at: row.item.deleted_at,
    }));
    return itemsWithDetails;
  }

  async updateItem(data: UpdateItem, item_id: string) {
    await this.db
      .update(item)
      .set(data)
      .where(eq(item.item_id, Number(item_id)));
  }

  async deleteItem(paramsId: number): Promise<void> {
    await this.db
      .update(item)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(item.item_id, paramsId));
  }
}

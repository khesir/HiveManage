import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import {
  category,
  item_record,
  price_history,
  product,
  product_category,
  SchemaType,
  supplier,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateProduct } from './product.model';
import { SupabaseService } from '@/supabase/supabase.service';

export class ProductService {
  private db: PostgresJsDatabase<SchemaType>;
  private supabaseService: SupabaseService;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
    this.supabaseService = SupabaseService.getInstance();
  }

  async createProduct(
    data: CreateProduct,
    file: Express.Multer.File | undefined,
  ) {
    return this.db.transaction(async (tx) => {
      let filePath = undefined;
      if (file) {
        filePath = await this.supabaseService.uploadImageToBucket(file);
      }
      const [newProduct] = await tx
        .insert(product)
        .values({
          name: String(data.name),
          description: String(data.description),
          img_url: filePath,
          stock_limit: data.stock_limit,
        })
        .returning({ product_id: product.product_id });
      await tx.insert(price_history).values({
        price: String(data.price_history),
        product_id: newProduct.product_id,
      });
    });
  }

  async getAllProduct(
    sort: string,
    limit: number,
    offset: number,
    no_pagination: boolean,
    category_id: string | undefined,
    product_name: string | undefined,
  ) {
    const conditions = [isNull(product.deleted_at)];
    if (product_name) {
      conditions.push(sql`${product.name} LIKE ${'%' + product_name + '%'}`);
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(product)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const productCategories = await this.db
      .select()
      .from(product_category)
      .leftJoin(
        category,
        eq(category.category_id, product_category.category_id),
      )
      .where(isNull(product_category.deleted_at));

    const categoryByProduct = productCategories.reduce<
      Record<number, unknown[]>
    >((acc, product_category) => {
      const productID = product_category.product_category.product_id;
      if (productID !== null && !(productID in acc)) {
        acc[productID] = [];
      }
      if (productID !== null) {
        acc[productID].push({
          ...product_category.product_category,
          category: { ...product_category.category },
        });
      }
      return acc;
    }, {});

    const itemRecords = await this.db
      .select()
      .from(item_record)
      .leftJoin(supplier, eq(item_record.supplier_id, supplier.supplier_id))
      .where(isNull(item_record.deleted_at));

    const itemRecordsByProduct = itemRecords.reduce<Record<number, unknown[]>>(
      (acc, record) => {
        const recordID = record.item_record.product_id;
        if (recordID !== null && !(recordID in acc)) {
          acc[recordID] = [];
        }
        if (recordID !== null) {
          acc[recordID].push({
            ...record.item_record,
            supplier: { ...record.supplier },
          });
        }
        return acc;
      },
      {},
    );

    const priceHistory = await this.db
      .select()
      .from(price_history)
      .where(isNull(price_history.deleted_at));

    const priceHistoryByProduct = priceHistory.reduce<
      Record<number, unknown[]>
    >((acc, price) => {
      const recordID = price.product_id;
      if (recordID !== null && !(recordID in acc)) {
        acc[recordID] = [];
      }
      if (recordID !== null) {
        acc[recordID].push({
          ...price,
        });
      }
      return acc;
    }, {});

    const query = this.db
      .select()
      .from(product)
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(product.created_at) : desc(product.created_at),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }
    const result = await query;
    const productWithDetails = result
      .filter((row) => {
        const categories = categoryByProduct[row.product_id] || [];

        // Include products based on category_id condition
        if (Number(category_id)) {
          // If category_id is specified, check if the product belongs to the category
          return categories.some(
            (category: unknown) =>
              (category as { category_id: number }).category_id ===
              Number(category_id),
          );
        }

        // If category_id is not specified, include all products
        return true;
      })
      .map((row) => ({
        ...row,
        price_history: priceHistoryByProduct[row.product_id] || [],
        product_categories: categoryByProduct[row.product_id] || [],
        item_record: itemRecordsByProduct[row.product_id] || [],
      }));
    return { totalData, productWithDetails };
  }

  async getProductById(product_id: number) {
    const productCategories = await this.db
      .select()
      .from(product_category)
      .leftJoin(
        category,
        eq(category.category_id, product_category.category_id),
      )
      .where(isNull(product_category.deleted_at));

    const categoryByProduct = productCategories.reduce<
      Record<number, unknown[]>
    >((acc, product_category) => {
      const productID = product_category.product_category.product_id;
      if (productID !== null && !(productID in acc)) {
        acc[productID] = [];
      }
      if (productID !== null) {
        acc[productID].push({
          ...product_category.product_category,
          category: { ...product_category.category },
        });
      }
      return acc;
    }, {});

    const inventoryRecords = await this.db
      .select()
      .from(item_record)
      .leftJoin(supplier, eq(item_record.supplier_id, supplier.supplier_id))
      .where(isNull(item_record.deleted_at));

    const inventoryRecordByProduct = inventoryRecords.reduce<
      Record<number, unknown[]>
    >((acc, record) => {
      const recordID = record.item_record.product_id;
      if (recordID !== null && !(recordID in acc)) {
        acc[recordID] = [];
      }
      if (recordID !== null) {
        acc[recordID].push({
          ...record.item_record,
          supplier: { ...record.supplier },
        });
      }
      return acc;
    }, {});

    const priceHistory = await this.db
      .select()
      .from(price_history)
      .where(isNull(price_history.deleted_at));

    const priceHistoryByProduct = priceHistory.reduce<
      Record<number, unknown[]>
    >((acc, price) => {
      const recordID = price.product_id;
      if (recordID !== null && !(recordID in acc)) {
        acc[recordID] = [];
      }
      if (recordID !== null) {
        acc[recordID].push({
          ...price,
        });
      }
      return acc;
    }, {});

    const result = await this.db
      .select()
      .from(product)
      .where(eq(product.product_id, Number(product_id)));

    const productWithDetails = result.map((row) => ({
      ...row,
      price_history: priceHistoryByProduct[row.product_id] || [],
      product_categories: categoryByProduct[row.product_id] || [],
      item_record: inventoryRecordByProduct[row.product_id] || [],
    }));
    return productWithDetails;
  }

  async updateProduct(data: object, paramsId: number) {
    await this.db
      .update(product)
      .set(data)
      .where(eq(product.product_id, paramsId));
  }

  async deleteProduct(paramsId: number): Promise<void> {
    await this.db
      .update(product)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(product.product_id, paramsId));
  }
}

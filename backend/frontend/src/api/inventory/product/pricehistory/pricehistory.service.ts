import {
  category,
  price_history,
  product,
  product_category,
  remarktickets,
  SchemaType,
} from '@/drizzle/drizzle.schema';
import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreatePriceHistory } from './pricehistory.model';

export class PriceHistoryService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createPriceHistory(data: CreatePriceHistory) {
    await this.db.insert(price_history).values({
      ...data,
      price: data.price.toString(), // Convert price to string
    });
  }

  async getAllPriceHistory(
    product_id: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(price_history.deleted_at)];

    if (product_id) {
      conditions.push(eq(price_history.product_id, Number(product_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(remarktickets)
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
      const categoryId = product_category.product_category?.category_id;
      if (categoryId !== null && !(categoryId in acc)) {
        acc[categoryId] = [];
      }
      if (categoryId !== null) {
        acc[categoryId].push({
          ...product_category.product_category,
          category: { ...product_category.product_category },
        });
      }
      return acc;
    }, {});
    const result = await this.db
      .select()
      .from(price_history)
      .leftJoin(product, eq(product.product_id, price_history.product_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(price_history.created_at)
          : desc(price_history.created_at),
      )
      .limit(limit)
      .offset(offset);

    const pricehistoryitemWithDetails = result.map((row) => ({
      ...row.price_history,
      product: {
        ...row.product,
        categories: categoryByProduct[row.product!.product_id],
      },
    }));

    return { totalData, pricehistoryitemWithDetails };
  }

  async getPriceHistoryByID(price_history_id: string) {
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
      const categoryId = product_category.product_category?.category_id;
      if (categoryId !== null && !(categoryId in acc)) {
        acc[categoryId] = [];
      }
      if (categoryId !== null) {
        acc[categoryId].push({
          ...product_category.product_category,
          category: { ...product_category.product_category },
        });
      }
      return acc;
    }, {});
    const result = await this.db
      .select()
      .from(price_history)
      .leftJoin(product, eq(product.product_id, price_history.product_id))
      .where(eq(price_history.price_history_id, Number(price_history_id)));

    const pricehistoryitemWithDetails = result.map((row) => ({
      ...row.price_history,
      product: {
        ...row.product,
        categories: categoryByProduct[row.product!.product_id],
      },
    }));
    return pricehistoryitemWithDetails;
  }

  async updatePriceHistory(data: object, paramsId: number) {
    await this.db
      .update(price_history)
      .set(data)
      .where(eq(price_history.price_history_id, paramsId));
  }

  async deletePriceHistory(paramsId: number): Promise<void> {
    await this.db
      .update(price_history)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(price_history.price_history_id, paramsId));
  }
}

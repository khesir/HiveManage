import { and, eq, isNull, sql, asc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SupabaseService } from '@/supabase/supabase.service';
import { product, supplier, productDetails } from '@/drizzle/schema/ims';
import { SchemaType } from '@/drizzle/schema/type';
import { CreateProduct } from './product.model';

export class ProductService {
  private db: PostgresJsDatabase<SchemaType>;
  private supabaseService: SupabaseService;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
    this.supabaseService = SupabaseService.getInstance();
  }

  async createProduct(data: CreateProduct) {
    await this.db.insert(product).values(data);
  }

  async getAllProduct(
    supplier_id: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(product.deleted_at)];

    if (supplier_id) {
      conditions.push(eq(product.supplier_id, Number(supplier_id)));
    }

    const totalCountQuery = await this.db
      .select({ count: sql<number>`COUNT(*)` })
      .from(product)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(product)
      .leftJoin(supplier, eq(supplier.supplier_id, product.supplier_id))
      .leftJoin(
        productDetails,
        eq(productDetails.p_details_id, product.p_details_id),
      )
      .where(and(...conditions))
      .orderBy(sort == 'asc' ? asc(product.created_at) : product.created_at)
      .limit(limit)
      .offset(offset);

    const productWithDetails = result.map((row) => ({
      ...row.product,
      supplier: {
        ...row.supplier,
      },
      productDetails: {
        ...row.product_details,
      },
    }));

    return { totalData, productWithDetails };
  }

  async getProductById(product_id: number) {
    const result = await this.db
      .select()
      .from(product)
      .leftJoin(supplier, eq(supplier.supplier_id, product.supplier_id))
      .leftJoin(
        productDetails,
        eq(productDetails.p_details_id, product.p_details_id),
      )
      .where(eq(product.product_id, Number(product_id)));

    const productWithDetails = result.map((row) => ({
      ...row.product,
      supplier: {
        ...row.supplier,
      },
      productDetails: {
        ...row.product_details,
      },
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

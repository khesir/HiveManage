import { eq, isNull, asc, desc, sql } from 'drizzle-orm';
import {
  category,
  product_category,
  SchemaType,
  supplier,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateSupplier } from './supplier.model';
import { SupabaseService } from '@/supabase/supabase.service';

export class SupplierService {
  private db: PostgresJsDatabase<SchemaType>;
  private supabaseSerivce: SupabaseService;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
    this.supabaseSerivce = SupabaseService.getInstance();
  }

  async createSupplier(
    data: CreateSupplier,
    file: Express.Multer.File | undefined,
  ) {
    return this.db.transaction(async (tx) => {
      let filePath = undefined;
      if (file) {
        filePath = await this.supabaseSerivce.uploadImageToBucket(file);
      }
      const [newSupplier] = await tx
        .insert(supplier)
        .values({
          name: String(data.name),
          remarks: String(data.remarks),
          relationship: String(data.relationship),
          contact_number: String(data.contact_number),
          profile_link: filePath,
        })
        .returning({ supplier_id: supplier.supplier_id });
      if (product_category) {
        await Promise.all(
          data.product_categories.map((data) =>
            tx.insert(product_category).values({
              supplier_id: newSupplier.supplier_id,
              category_id: data?.category_id,
            }),
          ),
        );
      }
    });
  }

  async getAllSupplier(
    sort: string,
    limit: number,
    offset: number,
    no_pagination: boolean,
  ) {
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(product_category)
      .where(isNull(product_category.deleted_at));

    const totalData = totalCountQuery[0].count;
    const productCategories = await this.db
      .select()
      .from(product_category)
      .leftJoin(
        category,
        eq(category.category_id, product_category.category_id),
      )
      .where(isNull(product_category.deleted_at));
    const categoryBySupplier = productCategories.reduce<
      Record<number, unknown[]>
    >((acc, product_category) => {
      const supplierID = product_category.product_category.supplier_id;
      if (supplierID !== null && !(supplierID in acc)) {
        acc[supplierID] = [];
      }
      if (supplierID !== null) {
        acc[supplierID].push({
          ...product_category.product_category,
          category: { ...product_category.category },
        });
      }
      return acc;
    }, {});
    const query = this.db
      .select()
      .from(supplier)
      .where(isNull(supplier.deleted_at))
      .orderBy(
        sort === 'asc' ? asc(supplier.created_at) : desc(supplier.created_at),
      );
    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }
    const result = await query;
    const resultWithRelatedData = result.map((row) => ({
      ...row,
      categories: categoryBySupplier[row.supplier_id],
    }));
    return { totalData, resultWithRelatedData };
  }

  async getSupplierById(paramsId: number) {
    const result = await this.db
      .select()
      .from(supplier)
      .where(eq(supplier.supplier_id, paramsId));
    return result[0];
  }

  async updateSupplier(data: object, paramsId: number) {
    await this.db
      .update(supplier)
      .set(data)
      .where(eq(supplier.supplier_id, paramsId));
  }

  async deleteSupplier(paramsId: number): Promise<void> {
    await this.db
      .update(supplier)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(supplier.supplier_id, paramsId));
  }
}

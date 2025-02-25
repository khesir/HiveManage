import { and, eq, isNull, sql, asc, SQL, inArray } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SupabaseService } from '@/supabase/supabase.service';
import { SchemaType } from '@/drizzle/schema/type';
import { CreateProduct } from './product.model';
import {
  productDetails,
  product,
  category,
  supplier,
  productRecord,
  serializeProduct,
  orderItem,
  order,
} from '@/drizzle/schema/ims';
import { productCategory } from '@/drizzle/schema/ims/schema/product/productCategory.schema';
import { productSupplier } from '@/drizzle/schema/ims/schema/product/productSupplier.schema';

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

  async getAllProduct(sort: string, limit: number, offset: number) {
    const conditions = [isNull(product.deleted_at)];

    const result = await this.db
      .select()
      .from(product)
      .leftJoin(
        productDetails,
        eq(productDetails.p_details_id, product.p_details_id),
      )
      .where(and(...conditions))
      .orderBy(sort == 'asc' ? asc(product.created_at) : product.created_at)
      .limit(limit)
      .offset(offset);

    const productIds = result.map((p) => p.product.product_id);
    const recordByProduct = await this.getRecordByProduct(productIds);
    const serialByProduct = await this.getSerializedByProduct(productIds);
    const totalData = await this.getTotalDataByCondition(conditions);
    const categoryByProduct = await this.getCategoryByProduct();
    const supplierByProduct = await this.getSupplierbyProduct();

    const productWithDetails = result.map((row) => ({
      ...row.product,
      productDetails: {
        ...row.product_details,
      },
      productRecords: recordByProduct.get(row.product.product_id) || [],
      productSerials: serialByProduct.get(row.product.product_id) || [],
      productCategories: categoryByProduct.get(row.product.product_id) || [],
      productSuppliers: supplierByProduct.get(row.product.product_id) || [],
    }));

    return { totalData, productWithDetails };
  }

  async getProductById(product_id: number) {
    const result = await this.db
      .select()
      .from(product)
      .leftJoin(
        productDetails,
        eq(productDetails.p_details_id, product.p_details_id),
      )
      .where(eq(product.product_id, Number(product_id)));

    const productWithDetails = result.map((row) => ({
      ...row.product,
      productDetails: {
        ...row.product_details,
      },
    }));

    return productWithDetails;
  }

  private async getTotalDataByCondition(
    conditions: SQL<unknown>[],
  ): Promise<number> {
    const totalCountQuery = await this.db
      .select({ count: sql<number>`COUNT(*)` })
      .from(product)
      .where(and(...conditions));

    return totalCountQuery[0].count;
  }
  private async getSupplierbyProduct(): Promise<Map<number, unknown[]>> {
    const result = await this.db
      .select()
      .from(productSupplier)
      .leftJoin(supplier, eq(supplier.supplier_id, productSupplier.supplier_id))
      .where(isNull(productSupplier.deleted_at));

    const supplierByProduct = new Map<number, unknown[]>();

    result.forEach(({ product_supplier, supplier }) => {
      const productID = product_supplier.product_id;
      if (productID !== null) {
        if (!supplierByProduct.has(productID)) {
          supplierByProduct.set(productID, []);
        }
        supplierByProduct
          .get(productID)!
          .push({ ...product_supplier, supplier: { ...supplier } });
      }
    });
    return supplierByProduct;
  }

  private async getCategoryByProduct(): Promise<Map<number, unknown[]>> {
    const result = await this.db
      .select()
      .from(productCategory)
      .leftJoin(category, eq(category.category_id, productCategory.category_id))
      .where(isNull(productCategory.deleted_at));

    const categoryByProduct = new Map<number, unknown[]>();

    result.forEach(({ product_category, category }) => {
      const productID = product_category.product_id;
      if (productID !== null) {
        if (!categoryByProduct.has(productID)) {
          categoryByProduct.set(productID, []);
        }
        categoryByProduct
          .get(productID)!
          .push({ ...product_category, category: { ...category } });
      }
    });
    return categoryByProduct;
  }

  private async getOrderByProduct(): Promise<Map<number, unknown[]>> {
    const result = await this.db
      .select()
      .from(orderItem)
      .leftJoin(order, eq(order.order_id, orderItem.order_id))
      .where(isNull(orderItem.deleted_at));

    const orderByProduct = new Map<number, unknown[]>();

    result.forEach(({ order_item, order }) => {
      const productID = order_item.product_id;
      if (productID !== null) {
        if (!orderByProduct.has(productID)) {
          orderByProduct.set(productID, []);
        }
        orderByProduct
          .get(productID)!
          .push({ ...order_item, order: { ...order } });
      }
    });

    return orderByProduct;
  }

  private async getRecordByProduct(
    productIDs: number[],
  ): Promise<Map<number, unknown[]>> {
    const result = await this.db
      .select()
      .from(productRecord)
      .where(inArray(productRecord.product_id, productIDs));

    const productRecordsByProduct = new Map<number, unknown[]>();

    result.forEach((record) => {
      const productID = record.product_id!;
      if (!productRecordsByProduct.has(productID)) {
        productRecordsByProduct.set(productID, []);
      }
      productRecordsByProduct.get(productID)!.push(record);
    });
    return productRecordsByProduct;
  }
  private async getSerializedByProduct(
    productIDs: number[],
  ): Promise<Map<number, unknown[]>> {
    const result = await this.db
      .select()
      .from(serializeProduct)
      .where(inArray(serializeProduct.product_id, productIDs));

    const productSerialByProduct = new Map<number, unknown[]>();

    result.forEach((record) => {
      const productID = record.product_id!;

      if (!productSerialByProduct.has(productID)) {
        productSerialByProduct.set(productID, []);
      }
      productSerialByProduct.get(productID)!.push(record);
    });
    return productSerialByProduct;
  }
}

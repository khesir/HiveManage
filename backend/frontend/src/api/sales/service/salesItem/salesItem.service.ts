import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import {
  category,
  customer,
  employee,
  item_record,
  product,
  product_category,
  sales_items,
  SchemaType,
  service,
  supplier,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateSalesItem } from './salesItem.model';
import { z } from 'zod';

export class SalesItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  // Create Sales Item function
  async createSalesItem(data: z.infer<typeof CreateSalesItem>) {
    // Keep total_price as a number
    const salesItemData = {
      ...data,
      // No need to convert total_price to string here
    };

    await this.db.insert(sales_items).values(salesItemData);
  }

  async getAllSalesItem(
    service_id: string | undefined,
    sales_item_type: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(sales_items.deleted_at)];

    if (sales_item_type) {
      conditions.push(
        eq(
          sales_items.sales_item_type,
          sales_item_type as
            | 'Sales'
            | 'Joborder'
            | 'Borrow'
            | 'Purchase'
            | 'Exchange',
        ),
      );
    }

    if (service_id) {
      conditions.push(eq(sales_items.service_id, Number(service_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(sales_items)
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

    const result = await this.db
      .select()
      .from(sales_items)
      .leftJoin(product, eq(sales_items.product_id, product.product_id))
      .leftJoin(service, eq(service.service_id, sales_items.service_id))
      .leftJoin(employee, eq(employee.employee_id, service.employee_id))
      .leftJoin(customer, eq(customer.customer_id, service.customer_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(sales_items.created_at)
          : desc(sales_items.created_at),
      )
      .limit(limit)
      .offset(offset);

    const salesitemWithDetails = result.map((row) => ({
      ...row.sales_items,
      product: {
        ...row.product,
        product_categories: categoryByProduct[row.product!.product_id],
        item_record: inventoryRecordByProduct[row.product!.product_id],
      },
      service: {
        ...row.service,
        employee: {
          ...row.employee,
        },
        customer: {
          ...row.customer,
        },
      },
    }));

    return { totalData, salesitemWithDetails };
  }

  async getSalesItemById(sales_item_id: number) {
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

    const result = await this.db
      .select()
      .from(sales_items)
      .leftJoin(product, eq(product.product_id, sales_items.product_id))
      .leftJoin(service, eq(service.service_id, sales_items.service_id))
      .leftJoin(employee, eq(employee.employee_id, service.employee_id))
      .leftJoin(customer, eq(customer.customer_id, service.customer_id))
      .where(eq(sales_items.sales_items_id, Number(sales_item_id)));

    const salesitemWithDetails = result.map((row) => ({
      ...row.sales_items,
      product: {
        ...row.product,
        product_categories: categoryByProduct[row.product!.product_id],
        item_record: inventoryRecordByProduct[row.product!.product_id],
      },
      service: {
        ...row.service,
        employee: {
          ...row.employee,
        },
        customer: {
          ...row.customer,
        },
      },
    }));

    return salesitemWithDetails;
  }

  async updateSalesItem(data: object, paramsId: number) {
    await this.db
      .update(sales_items)
      .set(data)
      .where(eq(sales_items.sales_items_id, paramsId));
  }

  async deleteSalesItem(paramsId: number): Promise<void> {
    await this.db
      .update(sales_items)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(sales_items.sales_items_id, paramsId));
  }
}

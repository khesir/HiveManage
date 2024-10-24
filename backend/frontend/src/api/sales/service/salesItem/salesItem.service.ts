import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import {
  category,
  customer,
  employee,
  item,
  product,
  sales_items,
  service,
  supplier,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateSalesItem } from './salesItem.model';
import { z } from 'zod';

export class SalesItemService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  // Create Sales Item function
  async createSalesItem(data: z.infer<typeof CreateSalesItem>) {
    // Convert total_price to string for the database
    const salesItemData = {
      ...data,
      total_price: data.total_price.toString(), // Convert number to string
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

    const result = await this.db
      .select()
      .from(sales_items)
      .leftJoin(item, eq(sales_items.item_id, item.item_id))
      .leftJoin(product, eq(product.product_id, item.product_id))
      .leftJoin(category, eq(category.category_id, product.category_id))
      .leftJoin(supplier, eq(supplier.supplier_id, product.supplier_id))
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
      sales_item_id: row.sales_items.sales_items_id,
      item: {
        item_id: row.item?.item_id,
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
        stock: row.item?.stock,
        on_listing: row.item?.on_listing,
        tag: row.item?.tag,
        re_order_level: row.item?.re_order_level,
        created_at: row.item?.created_at,
        last_updated: row.item?.last_updated,
        deleted_at: row.item?.deleted_at,
      },
      service: {
        service_id: row.service?.service_id,
        employee: {
          employee_id: row.employee?.employee_id,
          firstname: row.employee?.firstname,
          middlename: row.employee?.middlename,
          lastname: row.employee?.lastname,
          status: row.employee?.status,
          created_at: row.employee?.created_at,
          last_updated: row.employee?.last_updated,
          deleted_at: row.employee?.deleted_at,
        },
        customer: {
          customer_id: row.customer?.customer_id,
          firstname: row.customer?.firstname,
          lastname: row.customer?.lastname,
          contact_phone: row.customer?.contact_phone,
          socials: row.customer?.socials,
          address_line: row.customer?.address_line,
          baranay: row.customer?.address_line,
          province: row.customer?.province,
          standing: row.customer?.standing,
        },
        service_title: row.service?.service_title,
        service_description: row.service?.service_description,
        service_status: row.service?.service_status,
        has_reservation: row.service?.has_reservation,
        has_sales_item: row.service?.has_sales_item,
        has_borrow: row.service?.has_borrow,
        has_job_order: row.service?.has_job_order,
        created_at: row.service?.created_at,
        last_updated: row.service?.last_updated,
        deleted_at: row.service?.deleted_at,
      },
      quantity: row.sales_items?.quantity,
      sales_item_type: row.sales_items?.sales_item_type,
      total_price: row.sales_items?.total_price,
      created_at: row.sales_items?.created_at,
      last_updated: row.sales_items?.last_updated,
      deleted_at: row.sales_items?.deleted_at,
    }));

    return { totalData, salesitemWithDetails };
  }

  async getSalesItemById(sales_item_id: number) {
    const result = await this.db
      .select()
      .from(sales_items)
      .leftJoin(item, eq(sales_items.item_id, item.item_id))
      .leftJoin(service, eq(service.service_id, sales_items.service_id))
      .where(eq(sales_items.sales_items_id, Number(sales_item_id)));

    const salesitemWithDetails = result.map((row) => ({
      sales_item_id: row.sales_items.sales_items_id,
      item: {
        item_id: row.item?.item_id,
        product_id: row.item?.product_id,
        stock: row.item?.stock,
        on_listing: row.item?.on_listing,
        tag: row.item?.tag,
        created_at: row.item?.created_at,
        last_updated: row.item?.last_updated,
        deleted_at: row.item?.deleted_at,
      },
      service: {
        service_id: row.service?.service_id,
        service_title: row.service?.service_title,
        service_description: row.service?.service_description,
        service_status: row.service?.service_status,
        has_reservation: row.service?.has_reservation,
        has_sales_item: row.service?.has_sales_item,
        has_borrow: row.service?.has_borrow,
        has_job_order: row.service?.has_job_order,
        created_at: row.service?.created_at,
        last_updated: row.service?.last_updated,
        deleted_at: row.service?.deleted_at,
      },
      quantity: row.sales_items?.quantity,
      sales_item_type: row.sales_items?.sales_item_type,
      total_price: row.sales_items?.total_price,
      created_at: row.sales_items?.created_at,
      last_updated: row.sales_items?.last_updated,
      deleted_at: row.sales_items?.deleted_at,
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

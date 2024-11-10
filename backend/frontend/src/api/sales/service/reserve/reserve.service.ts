import { and, eq, isNull, asc, desc, sql } from 'drizzle-orm';
import {
  category,
  customer,
  employee,
  item,
  product,
  reserve,
  SchemaType,
  service,
  supplier,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateReserve } from './reserve.model';
import z from 'zod/lib';

export class ReserveService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createReserve(data: z.infer<typeof CreateReserve>) {
    // Validate the data with Zod schema
    const parsedData = CreateReserve.parse(data);

    // Insert the validated data into the database
    await this.db.insert(reserve).values(parsedData);
  }

  async getAllReserve(
    service_id: string | undefined,
    reserve_status: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(reserve.deleted_at)];

    if (reserve_status) {
      // Define valid statuses as a string union type
      const validStatuses = [
        'Reserved',
        'Confirmed',
        'Cancelled',
        'Pending',
        'Completed',
      ] as const; // 'as const' infers a readonly tuple of strings
      if (
        validStatuses.includes(reserve_status as (typeof validStatuses)[number])
      ) {
        conditions.push(
          eq(
            reserve.reserve_status,
            reserve_status as (typeof validStatuses)[number],
          ),
        );
      } else {
        throw new Error(`Invalid payment status: ${reserve_status}`);
      }
    }
    if (service_id) {
      conditions.push(eq(reserve.service_id, Number(service_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(reserve)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(reserve)
      .leftJoin(item, eq(item.item_id, reserve.items_id))
      .leftJoin(product, eq(product.product_id, item.product_id))
      .leftJoin(category, eq(category.category_id, product.category_id))
      .leftJoin(supplier, eq(supplier.supplier_id, product.supplier_id))
      .leftJoin(service, eq(service.service_id, reserve.service_id))
      .leftJoin(employee, eq(employee.employee_id, service.employee_id))
      .leftJoin(customer, eq(customer.customer_id, service.customer_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(reserve.created_at) : desc(reserve.created_at),
      )
      .limit(limit)
      .offset(offset);
    const reserveWithDetails = result.map((row) => ({
      reserve_id: row.reserve.reserve_id,
      service: {
        service_id: row.service?.service_id,
        employee: {
          employee_id: row.employee?.employee_id,
          firstname: row.employee?.firstname,
          middlename: row.employee?.middlename,
          lastname: row.employee?.lastname,
          email: row.employee?.email,
          profile_link: row.employee?.profile_link,
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
        has_sales_item: row.service?.has_sales_item,
        has_borrow: row.service?.has_borrow,
        has_job_order: row.service?.has_job_order,
        created_at: row.service?.created_at,
        last_updated: row.service?.last_updated,
        deleted_at: row.service?.deleted_at,
      },
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
      reserve_status: row.reserve?.reserve_status,
      created_at: row.reserve?.created_at,
      last_updated: row.reserve?.last_updated,
      deleted_at: row.reserve?.deleted_at,
    }));

    return { totalData, reserveWithDetails };
  }

  async getReserveById(reserve_id: number) {
    const result = await this.db
      .select()
      .from(reserve)
      .leftJoin(item, eq(item.item_id, reserve.items_id))
      .leftJoin(product, eq(product.product_id, item.product_id))
      .leftJoin(category, eq(category.category_id, product.category_id))
      .leftJoin(supplier, eq(supplier.supplier_id, product.supplier_id))
      .leftJoin(service, eq(service.service_id, reserve.service_id))
      .leftJoin(employee, eq(employee.employee_id, service.employee_id))
      .leftJoin(customer, eq(customer.customer_id, service.customer_id))
      .where(eq(reserve.reserve_id, Number(reserve_id)));

    const reserveWithDetails = result.map((row) => ({
      reserve_id: row.reserve.reserve_id,
      service: {
        service_id: row.service?.service_id,
        employee: {
          employee_id: row.employee?.employee_id,
          firstname: row.employee?.firstname,
          middlename: row.employee?.middlename,
          lastname: row.employee?.lastname,
          email: row.employee?.email,
          profile_link: row.employee?.profile_link,
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
        has_sales_item: row.service?.has_sales_item,
        has_borrow: row.service?.has_borrow,
        has_job_order: row.service?.has_job_order,
        created_at: row.service?.created_at,
        last_updated: row.service?.last_updated,
        deleted_at: row.service?.deleted_at,
      },
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
      reserve_status: row.reserve?.reserve_status,
      created_at: row.reserve?.created_at,
      last_updated: row.reserve?.last_updated,
      deleted_at: row.reserve?.deleted_at,
    }));

    return reserveWithDetails;
  }

  async updateReserve(data: object, paramsId: number) {
    await this.db
      .update(reserve)
      .set(data)
      .where(eq(reserve.reserve_id, paramsId));
  }

  async deleteReserve(paramsId: number): Promise<void> {
    await this.db
      .update(reserve)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(reserve.reserve_id, paramsId));
  }
}

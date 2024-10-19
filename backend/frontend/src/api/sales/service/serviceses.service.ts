import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { customer, employee, sales, service } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateService } from './serviceses.model';

export class ServicesService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createServices(data: CreateService) {
    await this.db.insert(service).values(data);
  }

  async getAllServices(
    sort: string,
    limit: number,
    offset: number,
    service_type: string | undefined,
  ) {
    const conditions = [isNull(service.deleted_at)];
    if (service_type) {
      conditions.push(
        eq(
          service.service_type,
          service_type as
            | 'Repair'
            | 'Sell'
            | 'Buy'
            | 'Borrow'
            | 'Return'
            | 'Exchange',
        ),
      );
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(service)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(service)
      .leftJoin(sales, eq(sales.sales_id, service.sales_id))
      .leftJoin(employee, eq(employee.employee_id, sales.employee_id))
      .leftJoin(customer, eq(customer.customer_id, sales.customer_id))
      .where(isNull(service.deleted_at))
      .orderBy(
        sort === 'asc' ? asc(service.created_at) : desc(service.created_at),
      )
      .limit(limit)
      .offset(offset);

    const serviceWithDetails = result.map((row) => ({
      service_id: row.service.service_id,
      sales: {
        sales_id: row.sales?.sales_id,
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
        total_amount: row.sales?.total_amount,
        created_at: row.sales?.created_at,
        last_updated: row.sales?.last_updated,
        deleted_at: row.sales?.deleted_at,
      },
      service_title: row.service.service_title,
      service_type: row.service.service_type,
      created_at: row.service.created_at,
      last_updated: row.service.last_updated,
      deleted_at: row.service.deleted_at,
    }));
    return { totalData, serviceWithDetails };
  }

  async getServicesById(service_id: string) {
    const result = await this.db
      .select()
      .from(service)
      .leftJoin(sales, eq(sales.sales_id, service.sales_id))
      .leftJoin(employee, eq(employee.employee_id, sales.employee_id))
      .leftJoin(customer, eq(customer.customer_id, sales.customer_id))
      .where(eq(service.service_id, Number(service_id)));

    const serviceWithDetails = result.map((row) => ({
      service_id: row.service.service_id,
      sales: {
        sales_id: row.sales?.sales_id,
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
        total_amount: row.sales?.total_amount,
        created_at: row.sales?.created_at,
        last_updated: row.sales?.last_updated,
        deleted_at: row.sales?.deleted_at,
      },
      service_title: row.service.service_title,
      service_type: row.service.service_type,
      created_at: row.service.created_at,
      last_updated: row.service.last_updated,
      deleted_at: row.service.deleted_at,
    }));
    return serviceWithDetails;
  }

  async updateServices(data: object, paramsId: number) {
    await this.db
      .update(service)
      .set(data)
      .where(eq(service.service_id, paramsId));
  }

  async deleteServices(paramsId: number): Promise<void> {
    await this.db
      .update(service)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(service.service_id, paramsId));
  }
}

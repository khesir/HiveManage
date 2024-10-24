import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { customer, employee, service } from '@/drizzle/drizzle.schema';
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
    service_status: string | undefined,
    customer_id: string | undefined,
  ) {
    const conditions = [isNull(service.deleted_at)];
    if (service_status) {
      conditions.push(
        eq(service.service_status, service_status as 'Active' | 'Inactive'),
      );
    }
    if (customer_id) {
      conditions.push(eq(service.customer_id, Number(customer_id)));
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
      .leftJoin(employee, eq(employee.employee_id, service.employee_id))
      .leftJoin(customer, eq(customer.customer_id, service.customer_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(service.created_at) : desc(service.created_at),
      )
      .limit(limit)
      .offset(offset);

    const serviceWithDetails = result.map((row) => ({
      service_id: row.service.service_id,
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
      service_title: row.service.service_title,
      service_description: row.service?.service_description,
      service_status: row.service?.service_status,
      has_reservation: row.service.has_reservation,
      has_sales_item: row.service.has_sales_item,
      has_borrow: row.service.has_borrow,
      has_job_order: row.service.has_job_order,
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
      .leftJoin(employee, eq(employee.employee_id, service.employee_id))
      .leftJoin(customer, eq(customer.customer_id, service.customer_id))
      .where(eq(service.service_id, Number(service_id)));

    const serviceWithDetails = result.map((row) => ({
      service_id: row.service,
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
      service_title: row.service.service_title,
      service_description: row.service?.service_description,
      service_status: row.service?.service_status,
      has_reservation: row.service.has_reservation,
      has_sales_item: row.service.has_sales_item,
      has_borrow: row.service.has_borrow,
      has_job_order: row.service.has_job_order,
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

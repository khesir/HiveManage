import { and, eq, isNull, sql, desc, asc } from 'drizzle-orm';
import { customer, employee, sales } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class SalesService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createSales(data: object) {
    await this.db.insert(sales).values(data);
  }

  async getAllSales(sort: string, limit: number, offset: number) {
    const conditions = [isNull(sales.deleted_at)];

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(sales)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(sales)
      .leftJoin(employee, eq(sales.employee_id, employee.employee_id))
      .leftJoin(customer, eq(customer.customer_id, sales.customer_id))
      .where(and(...conditions))
      .orderBy(sort === 'asc' ? asc(sales.created_at) : desc(sales.created_at))
      .limit(limit)
      .offset(offset);

    const salesWihDetails = result.map((row) => ({
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
    }));
    return { totalData, salesWihDetails };
  }

  async getSalesById(sales_id: string) {
    const result = await this.db
      .select()
      .from(sales)
      .leftJoin(employee, eq(sales.employee_id, employee.employee_id))
      .leftJoin(customer, eq(customer.customer_id, sales.customer_id))
      .where(eq(sales.sales_id, Number(sales_id)));

    const salesWihDetails = result.map((row) => ({
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
    }));
    return salesWihDetails;
  }

  async updateSales(data: object, paramsId: number) {
    await this.db.update(sales).set(data).where(eq(sales.sales_id, paramsId));
  }

  async deleteSales(paramsId: number): Promise<void> {
    await this.db
      .update(sales)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(sales.sales_id, paramsId));
  }
}

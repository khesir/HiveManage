import { and, eq, isNull, sql, desc, asc, like, or } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateCustomer, UpdateCustomer } from './customer.model';
import { customer } from '@/drizzle/schema/customer';
import { SchemaType } from '@/drizzle/schema/type';
import { employee } from '@/drizzle/schema/ems';
import { employeeLog } from '@/drizzle/schema/records/schema/employeeLog';

export class CustomerService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createCustomer(data: CreateCustomer) {
    await this.db.transaction(async (tx) => {
      const [newCustomer] = await tx
        .insert(customer)
        .values(data)
        .returning({ customer_id: customer.customer_id });

      const empData = await tx
        .select()
        .from(employee)
        .where(eq(employee.employee_id, data.user));
      await tx.insert(employeeLog).values({
        employee_id: empData[0].employee_id,
        performed_by: empData[0].employee_id,
        action: `${empData[0].firstname} ${empData[0].lastname} added customer ${newCustomer.customer_id}`,
      });
    });
  }

  async getAllCustomer(
    email: string | undefined,
    sort: string,
    limit: number,
    offset: number,
    fullname: string | undefined,
  ) {
    const conditions = [isNull(customer.deleted_at)];

    if (email) {
      conditions.push(eq(customer.email, email));
    }

    if (fullname) {
      const likeFullname = `%${fullname}%`; // Partial match
      const nameConditions = or(
        like(customer.firstname, likeFullname),
        like(customer.middlename, likeFullname),
        like(customer.lastname, likeFullname),
      );
      if (nameConditions) {
        conditions.push(nameConditions);
      }
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(customer)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(customer)
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(customer.created_at) : desc(customer.created_at),
      )
      .limit(limit)
      .offset(offset);

    return {
      totalData,
      result,
    };
  }

  async getCustomerById(paramsId: number) {
    const result = await this.db
      .select()
      .from(customer)
      .where(eq(customer.customer_id, paramsId));
    return result[0];
  }

  async updateCustomer(data: UpdateCustomer, paramsId: number) {
    await this.db.transaction(async (tx) => {
      await tx
        .update(customer)
        .set({ ...data, contact_phone: data.contact_phone?.toString() })
        .where(eq(customer.customer_id, paramsId));
      const empData = await tx
        .select()
        .from(employee)
        .where(eq(employee.employee_id, data.user));
      await tx.insert(employeeLog).values({
        employee_id: empData[0].employee_id,
        performed_by: empData[0].employee_id,
        action: `${empData[0].firstname} ${empData[0].lastname} added customer ${paramsId}`,
      });
    });
  }

  async deleteCustomer(customerId: number): Promise<void> {
    await this.db
      .update(customer)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(customer.customer_id, customerId));
  }
}

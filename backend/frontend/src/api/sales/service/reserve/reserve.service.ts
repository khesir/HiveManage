import { and, eq, isNull, asc, desc, sql } from 'drizzle-orm';
import {
  customer,
  employee,
  reserve,
  SchemaType,
  service,
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
      ...row.reserve,
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

    return { totalData, reserveWithDetails };
  }

  async getReserveById(reserve_id: number) {
    const result = await this.db
      .select()
      .from(reserve)
      .leftJoin(service, eq(service.service_id, reserve.service_id))
      .leftJoin(employee, eq(employee.employee_id, service.employee_id))
      .leftJoin(customer, eq(customer.customer_id, service.customer_id))
      .where(eq(reserve.reserve_id, Number(reserve_id)));

    const reserveWithDetails = result.map((row) => ({
      ...row.reserve,
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

import { and, eq, isNull, sql, asc, desc, inArray } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { CreateService, UpdateService } from './service.model';
import {
  assignedEmployees,
  service,
  service_Type,
} from '@/drizzle/schema/services';
import { customer } from '@/drizzle/schema/customer';
import { employee } from '@/drizzle/schema/ems';
import { payment } from '@/drizzle/schema/payment';

export class ServicesService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createServices(data: CreateService) {
    await this.db.transaction(async (tx) => {
      const [newService] = await tx
        .insert(service)
        .values({ ...data })
        .returning({ service_id: service.service_id });

      if (data.user_id) {
        await tx.insert(assignedEmployees).values({
          service_id: newService.service_id,
          employee_id: data.user_id,
          is_leader: true,
        });
      }
    });
  }

  async getAllServices(
    service_type_id: string | undefined,
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(service.deleted_at)];

    if (service_type_id) {
      conditions.push(eq(service.service_id, Number(service_type_id)));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(service)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(service)
      .leftJoin(
        service_Type,
        eq(service_Type.service_type_id, service.service_type_id),
      )
      .leftJoin(customer, eq(customer.customer_id, service.customer_id))
      .leftJoin(payment, eq(payment.service_id, service.service_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(service.created_at) : desc(service.created_at),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;
    const serviceIds = result.map((s) => s.service?.service_id);

    const assignedByService =
      await this.getAssignedEmployeeByServiceIDs(serviceIds);

    const serviceWithDetails = result.map((row) => ({
      ...row.service,
      customer: row.customer,
      service_type: row.service_Type,
      assigned: assignedByService.get(row.service.service_id),
      payment: row.payment,
    }));

    return { totalData, serviceWithDetails };
  }

  async getServiceById(service_id: number) {
    const result = await this.db
      .select()
      .from(service)
      .leftJoin(
        service_Type,
        eq(service_Type.service_type_id, service.service_type_id),
      )
      .leftJoin(customer, eq(customer.customer_id, service.customer_id))
      .leftJoin(payment, eq(payment.service_id, service.service_id))
      .where(eq(service.service_id, Number(service_id)));

    const assignedByService = await this.getAssignedEmployeeByServiceIDs([
      service_id,
    ]);

    const serviceWithDetails = result.map((row) => ({
      ...row.service,
      customer: row.customer,
      service_type: row.service_Type,
      assigned: assignedByService.get(row.service.service_id),
      payment: row.payment,
    }));

    return serviceWithDetails;
  }

  async updateService(data: UpdateService, paramsId: number) {
    await this.db
      .update(service)
      .set(data)
      .where(eq(service.service_id, paramsId));
  }

  async deleteService(paramsId: number): Promise<void> {
    await this.db
      .update(service)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(service.service_id, paramsId));
  }

  private async getAssignedEmployeeByServiceIDs(
    serviceIDs: number[],
  ): Promise<Map<number, unknown[]>> {
    const result = await this.db
      .select()
      .from(assignedEmployees)
      .leftJoin(
        employee,
        eq(employee.employee_id, assignedEmployees.employee_id),
      )
      .where(inArray(assignedEmployees.service_id, serviceIDs));

    const assignedEmployeesByServiceID = new Map<number, unknown[]>();

    result.forEach((record) => {
      const serviceID = record.assigned_employees.service_id!;
      if (!assignedEmployeesByServiceID.has(serviceID)) {
        assignedEmployeesByServiceID.set(serviceID, []);
      }
      assignedEmployeesByServiceID.get(serviceID)!.push({
        ...record.assigned_employees,
        employee: record.employee,
      });
    });
    return assignedEmployeesByServiceID;
  }
}

import { and, eq, isNull, sql, asc, desc, inArray } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { CreateService, UpdateService } from './service.model';
import {
  assignedEmployees,
  service,
  service_Type,
} from '@/drizzle/schema/services';
import { employee } from '@/drizzle/schema/ems';
import { employeeLog } from '@/drizzle/schema/records/schema/employeeLog';
import { joborder } from '@/drizzle/schema/services/schema/service/joborder.schema';

export class ServicesService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createServices(data: CreateService) {
    return await this.db.transaction(async (tx) => {
      const [newService] = await tx
        .insert(service)
        .values({ ...data })
        .returning({ service_id: service.service_id });
      for (const item of data.assigned!) {
        await tx.insert(assignedEmployees).values({
          employee_id: item.employee_id,
          service_id: newService.service_id,
        });

        await tx.insert(employeeLog).values({
          employee_id: item.employee_id,
          action: `Assigned to service ${newService.service_id}`,
          performed_by: data.user_id,
        });
      }
      // Create employee logging
      await tx.insert(employeeLog).values({
        employee_id: data.user_id,
        action: 'Pushlied movie',
        performed_by: data.user_id,
      });
      const returnData = await tx
        .select()
        .from(service)
        .where(eq(service.service_id, newService.service_id));
      return returnData;
    });
  }

  async getAllServices(
    service_type_id: string | undefined,
    joborder_service_only: boolean,
    joborder_id: string | undefined,
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(service.deleted_at)];

    if (service_type_id) {
      conditions.push(eq(service.service_id, Number(service_type_id)));
    }
    if (joborder_service_only && joborder_id) {
      conditions.push(eq(service.joborder_id, Number(joborder_id)));
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
      .leftJoin(joborder, eq(joborder.joborder_id, service.joborder_id))
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
      service_type: row.service_Type,
      joborder: row.joborder,
      assigned: assignedByService.get(row.service.service_id),
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
      .where(eq(service.service_id, Number(service_id)));

    const assignedByService = await this.getAssignedEmployeeByServiceIDs([
      service_id,
    ]);

    const serviceWithDetails = result.map((row) => ({
      ...row.service,
      service_type: row.service_Type,
      assigned: assignedByService.get(row.service.service_id),
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

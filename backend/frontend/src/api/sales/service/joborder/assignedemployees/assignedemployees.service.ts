import { assignedemployees, jobOrder, service } from '@/drizzle/drizzle.schema';
import { and, eq, isNull, sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class AssignedEmployeeService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createAssignedEmployees(data: object) {
    await this.db.insert(assignedemployees).values(data);
  }

  async getAllAssignedEmployee(
    assigned_employee_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(assignedemployees.deleted_at)];

    if (assigned_employee_id) {
      conditions.push(
        eq(
          assignedemployees.assigned_employee_id,
          Number(assigned_employee_id),
        ),
      );
    }
    const totalCountQuery = await this.db
      .select({ count: sql<number>`COUNT(*)` })
      .from(assignedemployees)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(assignedemployees)
      .leftJoin(
        jobOrder,
        eq(assignedemployees.job_order_id, jobOrder.job_order_id),
      )
      .leftJoin(service, eq(jobOrder.service_id, service.service_id))
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);

    const AssignedEmployeeDetails = result.map((row) => ({
      assigned_employee_id: row.assignedemployees.assigned_employee_id,
      jobOrder: {
        job_order_id: row.joborder?.job_order_id,
        service: {
          service_id: row.service?.service_id,
          sales_id: row.service?.sales_id,
          service_title: row.service?.service_title,
          service_type: row.service?.service_type,
          created_at: row.service?.created_at,
          last_updated: row.service?.last_updated,
          deleted_at: row.service?.deleted_at,
        },
        created_at: row.joborder?.created_at,
        last_updated: row.joborder?.last_updated,
        deleted_at: row.joborder?.deleted_at,
      },
      employee_id: row.assignedemployees.employee_id,
      assigned_by: row.assignedemployees.assigned_by,
      created_at: row.assignedemployees.created_at,
      last_updated: row.assignedemployees.last_updated,
      deleted_at: row.assignedemployees.deleted_at,
    }));

    return { totalData, AssignedEmployeeDetails };
  }

  async getAssignEmployeeByID(assigned_employee_id: string) {
    const result = await this.db
      .select()
      .from(assignedemployees)
      .leftJoin(
        jobOrder,
        eq(assignedemployees.job_order_id, jobOrder.job_order_id),
      )
      .leftJoin(service, eq(jobOrder.service_id, service.service_id))
      .where(
        eq(
          assignedemployees.assigned_employee_id,
          Number(assigned_employee_id),
        ),
      );

    const AssignedEmployeeDetails = result.map((row) => ({
      assigned_employee_id: row.assignedemployees.assigned_employee_id,
      jobOrder: {
        job_order_id: row.joborder?.job_order_id,
        service: {
          service_id: row.service?.service_id,
          sales_id: row.service?.sales_id,
          service_title: row.service?.service_title,
          service_type: row.service?.service_type,
          created_at: row.service?.created_at,
          last_updated: row.service?.last_updated,
          deleted_at: row.service?.deleted_at,
        },
        created_at: row.joborder?.created_at,
        last_updated: row.joborder?.last_updated,
        deleted_at: row.joborder?.deleted_at,
      },
      employee_id: row.assignedemployees.employee_id,
      assigned_by: row.assignedemployees.assigned_by,
      created_at: row.assignedemployees.created_at,
      last_updated: row.assignedemployees.last_updated,
      deleted_at: row.assignedemployees.deleted_at,
    }));
    return AssignedEmployeeDetails;
  }

  async updateAssignedEmployees(data: object, paramsId: number) {
    await this.db
      .update(assignedemployees)
      .set(data)
      .where(eq(assignedemployees.assigned_employee_id, paramsId));
  }

  async deleteAssignedEmployee(paramsId: number): Promise<void> {
    await this.db
      .update(assignedemployees)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(assignedemployees.assigned_employee_id, paramsId));
  }
}

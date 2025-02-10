import {
  assignedemployees,
  employee,
  jobOrder,
  SchemaType,
} from '@/drizzle/drizzle.config';
import { and, eq, isNull } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateAssignedEmployees } from './assignedemployees.model';

export class AssignedEmployeeService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createAssignedEmployees(data: CreateAssignedEmployees) {
    await this.db.insert(assignedemployees).values(data);
  }

  async getAllAssignedEmployee(
    job_order_id: string | undefined,
    employee_id: string | undefined,
  ) {
    const conditions = [isNull(assignedemployees.deleted_at)];
    if (job_order_id) {
      conditions.push(eq(assignedemployees.job_order_id, Number(job_order_id)));
    }
    if (employee_id) {
      conditions.push(eq(assignedemployees.employee_id, Number(employee_id)));
    }
    const result = await this.db
      .select()
      .from(assignedemployees)
      .leftJoin(
        jobOrder,
        eq(jobOrder.job_order_id, assignedemployees.job_order_id),
      )
      .leftJoin(
        employee,
        eq(employee.employee_id, assignedemployees.employee_id),
      )
      .where(and(...conditions));

    const assignedEmployeeDetails = result.map((row) => ({
      assigned_employee_id: row.assignedemployees.assigned_employee_id,
      jobOrder: {
        job_order_id: row.joborder?.job_order_id,
        service_id: row.joborder?.service_id,
        uuid: row.joborder?.uuid,
        fee: row.joborder?.fee,
        joborder_status: row.joborder?.joborder_status,
        total_cost_price: row.joborder?.total_cost_price,
        created_at: row.joborder?.created_at,
        last_updated: row.joborder?.last_updated,
        deleted_at: row.joborder?.deleted_at,
      },
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
      assigned_by: row.assignedemployees.assigned_by,
      created_at: row.assignedemployees.created_at,
      last_updated: row.assignedemployees.last_updated,
      deleted_at: row.assignedemployees.deleted_at,
    }));

    return assignedEmployeeDetails;
  }

  async getAssignEmployeeByID(assigned_employee_id: string) {
    const result = await this.db
      .select()
      .from(assignedemployees)
      .leftJoin(
        jobOrder,
        eq(assignedemployees.job_order_id, jobOrder.job_order_id),
      )
      .leftJoin(
        employee,
        eq(assignedemployees.employee_id, employee.employee_id),
      )
      .where(
        eq(
          assignedemployees.assigned_employee_id,
          Number(assigned_employee_id),
        ),
      );

    const assignedEmployeeDetails = result.map((row) => ({
      assigned_employee_id: row.assignedemployees.assigned_employee_id,
      jobOrder: {
        job_order_id: row.joborder?.job_order_id,
        service_id: row.joborder?.service_id,
        uuid: row.joborder?.uuid,
        fee: row.joborder?.fee,
        joborder_status: row.joborder?.joborder_status,
        total_cost_price: row.joborder?.total_cost_price,
        created_at: row.joborder?.created_at,
        last_updated: row.joborder?.last_updated,
        deleted_at: row.joborder?.deleted_at,
      },
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
      assigned_by: row.assignedemployees.assigned_by,
      created_at: row.assignedemployees.created_at,
      last_updated: row.assignedemployees.last_updated,
      deleted_at: row.assignedemployees.deleted_at,
    }));

    return assignedEmployeeDetails;
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

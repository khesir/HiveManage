import {
  assignedemployees,
  employee,
  jobOrder,
  SchemaType,
} from '@/drizzle/drizzle.schema';
import { and, eq, isNull } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class AssignedEmployeeService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createAssignedEmployees(data: object) {
    await this.db.insert(assignedemployees).values(data);
  }

  async getAllAssignedEmployee(job_order_id: string) {
    const result = await this.db
      .select()
      .from(assignedemployees)
      .leftJoin(
        employee,
        eq(assignedemployees.employee_id, employee.employee_id),
      )
      .where(
        and(
          eq(assignedemployees.job_order_id, Number(job_order_id)),
          isNull(assignedemployees.deleted_at),
        ),
      );

    const assignedEmployeeDetails = result.map((row) => ({
      assigned_employee_id: row.assignedemployees.assigned_employee_id,
      job_order_id: row.assignedemployees.job_order_id,
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
      job_order_id: row.assignedemployees.job_order_id,
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

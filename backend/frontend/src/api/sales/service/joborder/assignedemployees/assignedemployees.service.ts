import { and, eq, isNull } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateAssignedEmployees } from './assignedemployees.model';
import { employee } from '@/drizzle/schema/ems';
import { assignedEmployees, jobOrder } from '@/drizzle/schema/services';
import { SchemaType } from '@/drizzle/schema/type';

export class AssignedEmployeeService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createAssignedEmployees(data: CreateAssignedEmployees) {
    await this.db.insert(assignedEmployees).values(data);
  }

  async getAllAssignedEmployee(
    job_order_id: string | undefined,
    employee_id: string | undefined,
  ) {
    const conditions = [isNull(assignedEmployees.deleted_at)];
    if (job_order_id) {
      conditions.push(eq(assignedEmployees.job_order_id, Number(job_order_id)));
    }
    if (employee_id) {
      conditions.push(eq(assignedEmployees.employee_id, Number(employee_id)));
    }
    const result = await this.db
      .select()
      .from(assignedEmployees)
      .leftJoin(
        jobOrder,
        eq(jobOrder.job_order_id, assignedEmployees.job_order_id),
      )
      .leftJoin(
        employee,
        eq(employee.employee_id, assignedEmployees.employee_id),
      )
      .where(and(...conditions));

    const assignedEmployeeDetails = result.map((row) => ({
      assigned_employee_id: row.assigned_employees.assigned_employee_id,
      jobOrder: {
        job_order_id: row.job_order?.job_order_id,
        uuid: row.job_order?.uuid,
        customer_d: row.job_order?.customer_id,
        fee: row.job_order?.fee,
        joborder_status: row.job_order?.joborder_status,
        total_cost_price: row.job_order?.total_cost_price,
        created_at: row.job_order?.created_at,
        last_updated: row.job_order?.last_updated,
        deleted_at: row.job_order?.deleted_at,
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
      assigned_by: row.assigned_employees.assigned_by,
      created_at: row.assigned_employees.created_at,
      last_updated: row.assigned_employees.last_updated,
      deleted_at: row.assigned_employees.deleted_at,
    }));

    return assignedEmployeeDetails;
  }

  async getAssignEmployeeByID(assigned_employee_id: string) {
    const result = await this.db
      .select()
      .from(assignedEmployees)
      .leftJoin(
        jobOrder,
        eq(assignedEmployees.job_order_id, jobOrder.job_order_id),
      )
      .leftJoin(
        employee,
        eq(assignedEmployees.employee_id, employee.employee_id),
      )
      .where(
        eq(
          assignedEmployees.assigned_employee_id,
          Number(assigned_employee_id),
        ),
      );

    const assignedEmployeeDetails = result.map((row) => ({
      assigned_employee_id: row.assigned_employees.assigned_employee_id,
      jobOrder: {
        job_order_id: row.job_order?.job_order_id,
        customer_od: row.job_order?.customer_id,
        uuid: row.job_order?.uuid,
        fee: row.job_order?.fee,
        joborder_status: row.job_order?.joborder_status,
        total_cost_price: row.job_order?.total_cost_price,
        created_at: row.job_order?.created_at,
        last_updated: row.job_order?.last_updated,
        deleted_at: row.job_order?.deleted_at,
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
      assigned_by: row.assigned_employees.assigned_by,
      created_at: row.assigned_employees.created_at,
      last_updated: row.assigned_employees.last_updated,
      deleted_at: row.assigned_employees.deleted_at,
    }));

    return assignedEmployeeDetails;
  }

  async updateAssignedEmployees(data: object, paramsId: number) {
    await this.db
      .update(assignedEmployees)
      .set(data)
      .where(eq(assignedEmployees.assigned_employee_id, paramsId));
  }

  async deleteAssignedEmployee(paramsId: number): Promise<void> {
    await this.db
      .update(assignedEmployees)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(assignedEmployees.assigned_employee_id, paramsId));
  }
}

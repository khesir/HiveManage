import {
  assignedemployees,
  borrow,
  employee,
  jobOrder,
} from '@/drizzle/drizzle.schema';
import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class AssignedEmployeeService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createAssignedEmployees(data: object) {
    await this.db.insert(assignedemployees).values(data);
  }

  async getAllAssignedEmployee(sort: string, limit: number, offset: number) {
    const conditions = [isNull(assignedemployees.deleted_at)];

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
      .leftJoin(employee, eq(jobOrder.service_id, employee.employee_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(borrow.created_at) : desc(borrow.created_at),
      )
      .limit(limit)
      .offset(offset);

    const AssignedEmployeeDetails = result.map((row) => ({
      assigned_employee_id: row.assignedemployees.assigned_employee_id,
      jobOrder: {
        job_order_id: row.joborder?.job_order_id,
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
        joborder_type_id: row.joborder?.joborder_type_id,
        service_id: row.joborder?.service_id,
        uuid: row.joborder?.uuid,
        fee: row.joborder?.fee,
        status: row.joborder?.status,
        created_at: row.joborder?.created_at,
        last_updated: row.joborder?.last_updated,
        deleted_at: row.joborder?.deleted_at,
      },
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
      .leftJoin(employee, eq(jobOrder.service_id, employee.employee_id))
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
        joborder_type_id: row.joborder?.joborder_type_id,
        service_id: row.joborder?.service_id,
        uuid: row.joborder?.uuid,
        fee: row.joborder?.fee,
        status: row.joborder?.status,
        created_at: row.joborder?.created_at,
        last_updated: row.joborder?.last_updated,
        deleted_at: row.joborder?.deleted_at,
      },
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

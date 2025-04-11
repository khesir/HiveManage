import { and, eq, isNull } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateAssignedEmployees } from './assignedemployees.model';
import { employee } from '@/drizzle/schema/ems';
import { assignedEmployees, service } from '@/drizzle/schema/services';
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
    service_id: string | undefined,
    employee_id: string | undefined,
  ) {
    const conditions = [isNull(assignedEmployees.deleted_at)];
    if (service_id) {
      conditions.push(eq(assignedEmployees.service_id, Number(service_id)));
    }
    if (employee_id) {
      conditions.push(eq(assignedEmployees.employee_id, Number(employee_id)));
    }
    const result = await this.db
      .select()
      .from(assignedEmployees)
      .leftJoin(service, eq(service.service_id, assignedEmployees.service_id))
      .leftJoin(
        employee,
        eq(employee.employee_id, assignedEmployees.employee_id),
      )
      .where(and(...conditions));

    const assignedEmployeeDetails = result.map((row) => ({
      assigned_employee_id: row.assigned_employees.assigned_employee_id,
      service: {
        service_id: row.service?.service_id,
        service_type_id: row.service?.service_type_id,
        uuid: row.service?.uuid,
        description: row.service?.description,
        fee: row.service?.fee,
        customer_id: row.service?.customer_id,
        service_status: row.service?.service_status,
        total_cost_price: row.service?.total_cost_price,
        created_at: row.service?.created_at,
        last_updated: row.service?.last_updated,
        deleted_at: row.service?.deleted_at,
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
      .leftJoin(service, eq(assignedEmployees.service_id, service.service_id))
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
      service: {
        service_id: row.service?.service_id,
        service_type_id: row.service?.service_type_id,
        uuid: row.service?.uuid,
        description: row.service?.description,
        fee: row.service?.fee,
        customer_id: row.service?.customer_id,
        service_status: row.service?.service_status,
        total_cost_price: row.service?.total_cost_price,
        created_at: row.service?.created_at,
        last_updated: row.service?.last_updated,
        deleted_at: row.service?.deleted_at,
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

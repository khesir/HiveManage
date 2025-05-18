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
      ...row.assigned_employees,
      service: {
        ...row.service,
      },
      employee: {
        ...row.employee,
      },
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
      ...row.assigned_employees,
      service: {
        ...row.service,
      },
      employee: {
        ...row.employee,
      },
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

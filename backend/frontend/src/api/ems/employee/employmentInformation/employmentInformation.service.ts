import { eq, isNull, and } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import {
  department,
  designation,
  employmentInformation,
} from '@/drizzle/drizzle.schema';
import { EmploymentInformation } from './employmentInformation.model';

export class EmploymentInformationService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async getEmploymentInformation(employmentID: number, employeeID: number) {
    const conditions = [isNull(employmentInformation.deleted_at)];

    if (!isNaN(employeeID) && !isNaN(employmentID)) {
      conditions.push(
        eq(employmentInformation.employee_id, employeeID),
        eq(employmentInformation.employment_information_id, employmentID),
      );
    } else if (!isNaN(employmentID)) {
      conditions.push(
        eq(employmentInformation.employment_information_id, employmentID),
      );
    } else if (!isNaN(employeeID)) {
      conditions.push(eq(employmentInformation.employee_id, employeeID));
    }

    const result = await this.db
      .select()
      .from(employmentInformation)
      .leftJoin(
        department,
        eq(employmentInformation.department_id, department.department_id),
      )
      .leftJoin(
        designation,
        eq(employmentInformation.designation_id, designation.designation_id),
      )
      .where(and(...conditions));

    const mergedDetails = result.map((row) => ({
      employment_information_id: row.employment_info.employment_information_id,
      employee_id: row.employment_info.employee_id,
      hireDate: row.employment_info.hireDate,
      department: {
        department_id: row.department?.department_id,
        name: row.department?.name,
        status: row.department?.status,
        created_at: row.department?.created_at,
        last_updated: row.department?.last_updated,
        deleted_at: row.department?.deleted_at,
      },
      designation: {
        department_id: row.designation?.designation_id,
        name: row.designation?.title,
        status: row.designation?.status,
        created_at: row.designation?.created_at,
        last_updated: row.designation?.last_updated,
        deleted_at: row.designation?.deleted_at,
      },
      employee_type: row.employment_info.employee_type,
      employee_status: row.employment_info.employee_status,
      created_at: row.employment_info?.created_at,
      last_updated: row.employment_info?.last_updated,
      deleted_at: row.employment_info?.deleted_at,
    }));
    return mergedDetails;
  }

  async createEmploymentInformation(
    employee_id: number,
    data: EmploymentInformation,
  ) {
    await this.db
      .insert(employmentInformation)
      .values({ employee_id: employee_id, ...data });
  }
  async updateEmploymentInformation(
    employee_id: number,
    employmentID: number,
    data: EmploymentInformation,
  ) {
    await this.db
      .update(employmentInformation)
      .set({ employee_id: employee_id, ...data })
      .where(eq(employmentInformation.employment_information_id, employmentID));
  }
  async deleteEmployementInformation(employmentID: number) {
    await this.db
      .update(employmentInformation)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(employmentInformation.employment_information_id, employmentID));
  }
}

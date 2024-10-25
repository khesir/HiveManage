import { eq, isNull, and } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import {
  department,
  designation,
  employmentInformation,
  SchemaType,
} from '@/drizzle/drizzle.schema';
import { EmploymentInformation } from './employmentInformation.model';

export class EmploymentInformationService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async getEmploymentInformation(employmentID: number, employeeID: number) {
    const conditions = [isNull(employmentInformation.deleted_at)];

    if (!isNaN(employeeID) && !isNaN(employmentID)) {
      conditions.push(
        eq(employmentInformation.employment_information_id, employmentID),
      );
    } else if (!isNaN(employmentID)) {
      conditions.push(
        eq(employmentInformation.employment_information_id, employmentID),
      );
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
        title: row.designation?.title,
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

  async createEmploymentInformation(data: EmploymentInformation) {
    await this.db.insert(employmentInformation).values(data);
  }
  async updateEmploymentInformation(
    employmentID: number,
    data: EmploymentInformation,
  ) {
    await this.db
      .update(employmentInformation)
      .set(data)
      .where(eq(employmentInformation.employment_information_id, employmentID));
  }
  async deleteEmployementInformation(employmentID: number) {
    await this.db
      .update(employmentInformation)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(employmentInformation.employment_information_id, employmentID));
  }
}

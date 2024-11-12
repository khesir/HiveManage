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

  async getEmploymentInformation(
    employmentID: string,
    employeeID: string | undefined,
  ) {
    const conditions = [isNull(employmentInformation.deleted_at)];

    if (employmentID && !isNaN(Number(employmentID))) {
      conditions.push(
        eq(
          employmentInformation.employment_information_id,
          Number(employmentID),
        ),
      );
    } else if (employeeID && !isNaN(Number(employeeID))) {
      conditions.push(
        eq(employmentInformation.employee_id, Number(employeeID)),
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
      ...row.employment_info,
      department: {
        ...row.department,
      },
      designation: {
        ...row.designation,
      },
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

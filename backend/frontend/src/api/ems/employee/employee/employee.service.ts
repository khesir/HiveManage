import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import {
  employee,
  employmentInformation,
  financialInformation,
  personalInformation,
  salaryInformation,
} from '../../../../../drizzle/drizzle.schema';

export class EmployeeService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async getAllEmployee(status: string | undefined) {
    if (status) {
      const result = await this.db
        .select()
        .from(employee)
        .where(eq(employee.status, status));
      return result;
    } else {
      const result = await this.db.select().from(employee);
      return result;
    }
  }

  async createEmployee(data: {
    employeeData: object;
    personalInfoData: object;
    salaryInfoData: object;
    financialInfoData: object;
    employmentInfoData: object;
  }): Promise<void> {
    await this.db.transaction(async (tx) => {
      // Insert employee data
      const [employeeId] = await tx
        .insert(employee)
        .values(data.employeeData)
        .$returningId();

      // Insert related data into sub-tables
      const entitiesToInsert = [
        {
          table: personalInformation,
          data: { ...data.personalInfoData, employee_id: employeeId },
        },
        {
          table: salaryInformation,
          data: { ...data.salaryInfoData, employee_id: employeeId },
        },
        {
          table: financialInformation,
          data: { ...data.financialInfoData, employee_id: employeeId },
        },
        {
          table: employmentInformation,
          data: { ...data.employmentInfoData, employee_id: employeeId },
        },
      ];

      for (const { table, data } of entitiesToInsert) {
        await tx.insert(table).values(data as object);
      }
    });
  }

  async getEmployeeById(paramsId: number) {
    const result = await this.db
      .select()
      .from(employee)
      .where(eq(employee.employee_id, paramsId));
    return result;
  }

  async updateEmployee(data: object, paramsId: number) {
    await this.db
      .update(employee)
      .set(data)
      .where(eq(employee.employee_id, paramsId));
  }

  async deleteEmployeeByID(employeeId: number): Promise<void> {
    await this.db.transaction(async (tx) => {
      const currentTime = new Date();

      // Check if the employee exists in personal information
      const [personalInfo] = await tx
        .select()
        .from(personalInformation)
        .where(eq(personalInformation.employee_id, employeeId));

      // If the employee exists, proceed to mark all related records as deleted
      if (personalInfo) {
        const entitiesToUpdate = [
          {
            table: personalInformation,
            column: personalInformation.employee_id,
          },
          { table: salaryInformation, column: salaryInformation.employee_id },
          {
            table: financialInformation,
            column: financialInformation.employee_id,
          },
          {
            table: employmentInformation,
            column: employmentInformation.employee_id,
          },
          { table: employee, column: employee.employee_id },
        ];

        // Update all related entities in a single transaction
        for (const { table, column } of entitiesToUpdate) {
          await tx
            .update(table)
            .set({ deleted_at: currentTime })
            .where(eq(column, employeeId));
        }
      }
    });
  }
}

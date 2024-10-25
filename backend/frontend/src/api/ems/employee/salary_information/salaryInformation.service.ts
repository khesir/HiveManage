import { eq, and, isNull } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { salaryInformation, SchemaType } from '@/drizzle/drizzle.schema';
import { SalaryInformation } from './salaryInformation.model';

export class SalaryInformationService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async getSalaryInformation(employeeID: number, salaryInfo_id: number) {
    const conditions = [isNull(salaryInformation.deleted_at)];

    if (!isNaN(employeeID) && !isNaN(salaryInfo_id)) {
      conditions.push(
        eq(salaryInformation.employee_id, employeeID),
        eq(salaryInformation.salary_information_id, salaryInfo_id),
      );
    } else if (!isNaN(salaryInfo_id)) {
      conditions.push(
        eq(salaryInformation.salary_information_id, salaryInfo_id),
      );
    } else if (!isNaN(employeeID)) {
      conditions.push(eq(salaryInformation.employee_id, employeeID));
    }
    const result = await this.db
      .select()
      .from(salaryInformation)
      .where(and(...conditions));
    return result;
  }

  async createSalaryInformation(employee_id: number, data: SalaryInformation) {
    await this.db
      .insert(salaryInformation)
      .values({ employee_id: employee_id, ...data });
  }
  async updateSalaryInformation(
    employee_id: number,
    paramsId: number,
    data: SalaryInformation,
  ) {
    await this.db
      .update(salaryInformation)
      .set({
        employee_id: employee_id,
        ...data,
      })
      .where(eq(salaryInformation.salary_information_id, paramsId));
  }

  async deleteSalaryInformation(paramsId: number) {
    await this.db
      .update(salaryInformation)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(salaryInformation.salary_information_id, paramsId));
  }
}

import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { salaryInformation } from '../../../../../drizzle/drizzle.schema';

export class SalaryInformationService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async getSalaryInformationByEmployeeID(paramsId: number) {
    const result = await this.db
      .select()
      .from(salaryInformation)
      .where(eq(salaryInformation.employee_id, paramsId));
    return result;
  }

  async updateSalaryInformation(data: object, paramsId: number) {
    await this.db
      .update(salaryInformation)
      .set(data)
      .where(eq(salaryInformation.salary_information_id, paramsId));
  }
}

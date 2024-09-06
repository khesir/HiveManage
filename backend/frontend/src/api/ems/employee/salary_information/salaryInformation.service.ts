import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { salaryInformation } from '../../../../../drizzle/drizzle.schema';

export class SalaryInformationService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async getSalaryInformation(paramsID: number, queryId: number) {
    if (!isNaN(queryId)) {
      const result = await this.db
        .select()
        .from(salaryInformation)
        .where(eq(salaryInformation.employee_id, queryId));
      return result;
    } else if (!isNaN(paramsID)) {
      const result = await this.db
        .select()
        .from(salaryInformation)
        .where(eq(salaryInformation.salary_information_id, paramsID));
      return result;
    } else {
      const result = await this.db.select().from(salaryInformation);
      return result;
    }
  }

  async updateSalaryInformation(data: object, paramsId: number) {
    await this.db
      .update(salaryInformation)
      .set(data)
      .where(eq(salaryInformation.salary_information_id, paramsId));
  }

  async deleteSalaryInformation(paramsID: number) {
    await this.db
      .update(salaryInformation)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(salaryInformation.salary_information_id, paramsID));
  }
}

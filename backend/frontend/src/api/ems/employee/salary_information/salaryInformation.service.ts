import { eq, and, isNull } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { salaryInformation } from '../../../../../drizzle/drizzle.schema';

export class SalaryInformationService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async getSalaryInformation(paramsId: number, queryId: number) {
    if (!isNaN(queryId)) {
      const result = await this.db
        .select()
        .from(salaryInformation)
        .where(and(eq(salaryInformation.employee_id, queryId), isNull(salaryInformation.deleted_at)));
      return result;
    } else if (!isNaN(paramsId)) {
      const result = await this.db
        .select()
        .from(salaryInformation)
        .where(and(eq(salaryInformation.salary_information_id, paramsId), isNull(salaryInformation.deleted_at)));
      return result;
    } else {
      const result = await this.db.select().from(salaryInformation).where(isNull(salaryInformation.deleted_at));
      return result;
    }
  }
  async createSalaryInformation(data: object) {
    await this.db.insert(salaryInformation).values(data);
  }
  async updateSalaryInformation(data: object, paramsId: number) {
    await this.db
      .update(salaryInformation)
      .set(data)
      .where(eq(salaryInformation.salary_information_id, paramsId));
  }

  async deleteSalaryInformation(paramsId: number) {
    await this.db
      .update(salaryInformation)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(salaryInformation.salary_information_id, paramsId));
  }
}

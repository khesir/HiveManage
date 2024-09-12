import { eq, isNull,and } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { employmentInformation } from '../../../../../drizzle/drizzle.schema';

export class EmploymentInformationService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async getEmploymentInformation(paramsId: number, queryId: number) {
    if (!isNaN(queryId)) {
      const result = await this.db
        .select()
        .from(employmentInformation)
        .where(and(eq(employmentInformation.employee_id, queryId),isNull(employmentInformation.deleted_at)));
      return result;
    } else if (!isNaN(paramsId)) {
      const result = await this.db
        .select()
        .from(employmentInformation)
        .where(eq(employmentInformation.employment_information_id, paramsId));
      return result;
    } else {
      const result = await this.db.select().from(employmentInformation).where(isNull(employmentInformation.deleted_at));
      return result;
    }
  }

  async createEmploymentInformation(data: object) {
    await this.db.insert(employmentInformation).values(data);
  }
  async updateEmploymentInformation(data: object, paramsId: number) {
    await this.db
      .update(employmentInformation)
      .set(data)
      .where(eq(employmentInformation.employment_information_id, paramsId));
  }
  async deleteEmployementInformation(paramsId: number) {
    await this.db
      .update(employmentInformation)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(employmentInformation.employment_information_id, paramsId));
  }
}

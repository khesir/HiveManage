import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { employmentInformation } from '../../../../../drizzle/drizzle.schema';

export class EmploymentInformationService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async getEmploymentInformation(paramsID: number, queryId: number) {
    if (!isNaN(queryId)) {
      const result = await this.db
        .select()
        .from(employmentInformation)
        .where(eq(employmentInformation.employee_id, queryId));
      return result;
    } else if (!isNaN(paramsID)) {
      const result = await this.db
        .select()
        .from(employmentInformation)
        .where(eq(employmentInformation.employment_information_id, paramsID));
      return result;
    } else {
      const result = await this.db.select().from(employmentInformation);
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

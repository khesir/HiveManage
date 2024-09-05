import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { employmentInformation } from '../../../../../drizzle/drizzle.schema';

export class EmploymentInformationService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async getEmploymentInformationByEmployeeID(paramsId: number) {
    const result = await this.db
      .select()
      .from(employmentInformation)
      .where(eq(employmentInformation.employee_id, paramsId));
    return result;
  }

  async updateEmploymentInformation(data: object, paramsId: number) {
    await this.db
      .update(employmentInformation)
      .set(data)
      .where(eq(employmentInformation.employment_information_id, paramsId));
  }
}

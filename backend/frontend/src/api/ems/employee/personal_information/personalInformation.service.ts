import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { personalInformation } from '../../../../../drizzle/drizzle.schema';

export class PersonalInformationService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async getPersonalInformationByEmployeeID(paramsId: number) {
    const result = await this.db
      .select()
      .from(personalInformation)
      .where(eq(personalInformation.employee_id, paramsId));
    return result;
  }

  async updatePersonalInformation(data: object, paramsId: number) {
    await this.db
      .update(personalInformation)
      .set(data)
      .where(eq(personalInformation.personal_information_id, paramsId));
  }
}

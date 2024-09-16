import { eq, isNull, and } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { personalInformation } from '../../../../../drizzle/drizzle.schema';

export class PersonalInformationService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async getPersonalInformation(personalID: number, employeeID: number) {
    if (!isNaN(employeeID)) {
      const result = await this.db
        .select()
        .from(personalInformation)
        .where(
          and(
            eq(personalInformation.employee_id, employeeID),
            isNull(personalInformation.deleted_at),
          ),
        );
      return result;
    } else if (!isNaN(personalID)) {
      const result = await this.db
        .select()
        .from(personalInformation)
        .where(eq(personalInformation.personal_information_id, personalID));
      return result;
    } else {
      const result = await this.db
        .select()
        .from(personalInformation)
        .where(isNull(personalInformation.deleted_at));
      return result;
    }
  }

  async createPersonalInformation(data: object) {
    await this.db.insert(personalInformation).values(data);
  }

  async updatePersonalInformation(data: object, paramsId: number) {
    await this.db
      .update(personalInformation)
      .set(data)
      .where(eq(personalInformation.personal_information_id, paramsId));
  }

  async deletePersonalInformation(paramsId: number) {
    await this.db
      .update(personalInformation)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(personalInformation.personal_information_id, paramsId));
  }
}

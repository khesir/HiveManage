import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { personalInformation } from '../../../../../drizzle/drizzle.schema';

export class PersonalInformationService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async getPersonalInformation(paramsID: number, queryId: number) {
    if (!isNaN(queryId)) {
      const result = await this.db
        .select()
        .from(personalInformation)
        .where(eq(personalInformation.employee_id, queryId));
      return result;
    } else if (!isNaN(paramsID)) {
      const result = await this.db
        .select()
        .from(personalInformation)
        .where(eq(personalInformation.personal_information_id, paramsID));
      return result;
    } else {
      const result = await this.db.select().from(personalInformation);
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

  async deletePersonalInformation(paramsID: number) {
    await this.db
      .update(personalInformation)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(personalInformation.personal_information_id, paramsID));
  }
}
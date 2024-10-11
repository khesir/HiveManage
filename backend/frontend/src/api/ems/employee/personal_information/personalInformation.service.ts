import { eq, isNull, and } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { personalInformation } from '@/drizzle/drizzle.schema';
import { PersonalInformation } from './personalInformation.model';

export class PersonalInformationService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async getPersonalInformation(personalID: number, employeeID: number) {
    const conditions = [isNull(personalInformation.deleted_at)];

    if (!isNaN(employeeID) && !isNaN(personalID)) {
      conditions.push(
        eq(personalInformation.employee_id, employeeID),
        eq(personalInformation.personal_information_id, personalID),
      );
    } else if (!isNaN(personalID)) {
      conditions.push(
        eq(personalInformation.personal_information_id, personalID),
      );
    } else if (!isNaN(employeeID)) {
      conditions.push(eq(personalInformation.employee_id, employeeID));
    }
    const result = await this.db
      .select()
      .from(personalInformation)
      .where(and(...conditions));

    return result;
  }

  async createPersonalInformation(
    employee_id: number,
    data: PersonalInformation,
  ) {
    await this.db
      .insert(personalInformation)
      .values({ employee_id: employee_id, ...data });
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

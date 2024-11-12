import { eq, isNull, and } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { personalInformation, SchemaType } from '@/drizzle/drizzle.schema';
import { PersonalInformation } from './personalInformation.model';

export class PersonalInformationService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async getPersonalInformation(
    personalID: string,
    employeeID: string | undefined,
  ) {
    const conditions = [isNull(personalInformation.deleted_at)];
    console.log(employeeID);
    if (personalID && !isNaN(Number(personalID))) {
      conditions.push(
        eq(personalInformation.personal_information_id, Number(personalID)),
      );
    }

    if (employeeID && !isNaN(Number(employeeID))) {
      conditions.push(eq(personalInformation.employee_id, Number(employeeID)));
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

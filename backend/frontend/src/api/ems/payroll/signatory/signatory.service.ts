import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { signatory } from '../../../../../drizzle/drizzle.schema';
import { eq, and, isNull } from 'drizzle-orm';

export class SignatoryService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createSignatory(data: object) {
    await this.db.insert(signatory).values(data);
  }

  async getSignatory(paramsId: number, queryId: number) {
    if (!isNaN(queryId)) {
      const result = await this.db
        .select()
        .from(signatory)
        .where(and(eq(signatory.employee_id, queryId),isNull(signatory.deleted_at)));
      return result;
    } else if (!isNaN(paramsId)) {
      const result = await this.db
        .select()
        .from(signatory)
        .where(eq(signatory.signatory_id, paramsId));
      return result;
    } else {
      const result = await this.db.select().from(signatory).where(isNull(signatory.deleted_at));
      return result;
    }
  }

  async getAllSignatories(employee_id: number | undefined) {
    if (employee_id) {
      const result = await this.db
        .select()
        .from(signatory)
        .where(
          and(
            eq(signatory.employee_id, employee_id),
            isNull(signatory.deleted_at)
          )
        );
      return result;
    } else {
      const result = await this.db.select().from(signatory);
      return result;
    }
  }

  async updateSignatory(data: object, paramsId: number) {
    await this.db
      .update(signatory)
      .set(data)
      .where(eq(signatory.signatory_id, paramsId));
  }

  async deleteSignatory(paramsId: number) {
    console.log('Params-service: ' + paramsId);
    await this.db
      .update(signatory)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(signatory.signatory_id, paramsId));
  }
}

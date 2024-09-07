import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { signatory } from '../../../../../drizzle/drizzle.schema';
import { eq } from 'drizzle-orm';

export class SignatoryService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createSignatory(data: object) {
    await this.db.insert(signatory).values(data);
  }

  async getSignatory(paramsID: number, queryId: number) {
    if (!isNaN(queryId)) {
      const result = await this.db
        .select()
        .from(signatory)
        .where(eq(signatory.employee_id, queryId));
      return result;
    } else if (!isNaN(paramsID)) {
      const result = await this.db
        .select()
        .from(signatory)
        .where(eq(signatory.signatory_id, paramsID));
      return result;
    } else {
      const result = await this.db.select().from(signatory);
      return result;
    }
  }

  async getAllSignatories(employee_id: number | undefined) {
    if (employee_id) {
      const result = await this.db
        .select()
        .from(signatory)
        .where(eq(signatory.employee_id, employee_id));
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

  async deleteSignatory(paramsID: number) {
    console.log("Params-service: " + paramsID);
    await this.db
      .update(signatory)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(signatory.signatory_id, paramsID));
  }
}
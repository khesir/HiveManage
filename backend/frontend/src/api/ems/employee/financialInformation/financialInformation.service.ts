import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { financialInformation } from '../../../../../drizzle/drizzle.schema';

export class FinancialInformationService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }
  async getFinancialInformation(paramsID: number, queryId: number) {
    console.log(paramsID);
    console.log(queryId);
    if (!isNaN(queryId)) {
      const result = await this.db
        .select()
        .from(financialInformation)
        .where(eq(financialInformation.employee_id, queryId));
      return result;
    } else if (!isNaN(paramsID)) {
      const result = await this.db
        .select()
        .from(financialInformation)
        .where(eq(financialInformation.financial_id, paramsID));
      return result;
    } else {
      const result = await this.db.select().from(financialInformation);
      return result;
    }
  }

  async updateFinancialInformation(data: object, paramsId: number) {
    await this.db
      .update(financialInformation)
      .set(data)
      .where(eq(financialInformation.financial_id, paramsId));
  }
  async deleteFinancialInformation(paramsId: number) {
    await this.db
      .update(financialInformation)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(financialInformation.financial_id, paramsId));
  }
}

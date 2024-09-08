import { eq, isNull, and } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { financialInformation } from '../../../../../drizzle/drizzle.schema';

export class FinancialInformationService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }
  async getFinancialInformation(paramsId: number, queryId: number) {
    console.log(paramsId);
    console.log(queryId);
    if (!isNaN(queryId)) {
      const result = await this.db
        .select()
        .from(financialInformation)
        .where(and(eq(financialInformation.employee_id, queryId),isNull(financialInformation.deleted_at)));
      return result;
    } else if (!isNaN(paramsId)) {
      const result = await this.db
        .select()
        .from(financialInformation)
        .where(eq(financialInformation.financial_id, paramsId));
      return result;
    } else {
      const result = await this.db.select().from(financialInformation).where(isNull(financialInformation.deleted_at));
      return result;
    }
  }
  async createFinancialInformation(data: object) {
    await this.db.insert(financialInformation).values(data);
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

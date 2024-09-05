import { eq } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { financialInformation } from '../../../../../drizzle/drizzle.schema';

export class FinancialInformationService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async getFinancialInformationByEmployeeID(paramsId: number) {
    const result = await this.db
      .select()
      .from(financialInformation)
      .where(eq(financialInformation.employee_id, paramsId));
    return result;
  }

  async updateFinancialInformation(data: object, paramsId: number) {
    await this.db
      .update(financialInformation)
      .set(data)
      .where(eq(financialInformation.financial_id, paramsId));
  }
}

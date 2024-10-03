import { eq, isNull, and } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { financialInformation } from '@/drizzle/drizzle.schema';

export class FinancialInformationService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }
  async getFinancialInformation(paramsId: number, queryId: number) {
    if (!isNaN(queryId)) {
      const result = await this.db
        .select()
        .from(financialInformation)
        .where(
          and(
            eq(financialInformation.employee_id, queryId),
            isNull(financialInformation.deleted_at),
          ),
        );
      return result;
    } else if (!isNaN(paramsId)) {
      const result = await this.db
        .select()
        .from(financialInformation)
        .where(eq(financialInformation.financial_id, paramsId));
      return result;
    } else {
      const result = await this.db
        .select()
        .from(financialInformation)
        .where(isNull(financialInformation.deleted_at));
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

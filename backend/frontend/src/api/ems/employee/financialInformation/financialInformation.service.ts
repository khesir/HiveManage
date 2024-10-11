import { eq, isNull, and } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { financialInformation } from '@/drizzle/drizzle.schema';

export class FinancialInformationService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }
  async getFinancialInformation(financial_id: number, employee_id: number) {
    const conditions = [isNull(financialInformation.deleted_at)];

    if (!isNaN(employee_id) && !isNaN(financial_id)) {
      conditions.push(
        eq(financialInformation.employee_id, employee_id),
        eq(financialInformation.financial_id, financial_id),
      );
    } else if (!isNaN(financial_id)) {
      conditions.push(eq(financialInformation.financial_id, financial_id));
    } else if (!isNaN(employee_id)) {
      conditions.push(eq(financialInformation.employee_id, employee_id));
    }
    const result = await this.db
      .select()
      .from(financialInformation)
      .where(and(...conditions));

    return result;
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

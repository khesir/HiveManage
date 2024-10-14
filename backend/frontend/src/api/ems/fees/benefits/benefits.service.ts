import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { benefits } from '@/drizzle/drizzle.schema';
import { and, eq, isNull } from 'drizzle-orm';

export class BenefitsService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createBenefits(data: object) {
    await this.db.insert(benefits).values(data);
  }

  async updateBenefits(data: object, paramsId: number) {
    await this.db
      .update(benefits)
      .set(data)
      .where(eq(benefits.benefits_id, paramsId));
  }

  async getAllBenefits(
    benefitTypes: string | undefined,
    employee_id: string | undefined,
  ) {
    const conditions = [isNull(benefits.deleted_at)];

    if (benefitTypes) {
      conditions.push(eq(benefits.benefits_type, benefitTypes));
    }

    if (employee_id) {
      conditions.push(eq(benefits.employee_id, Number(employee_id)));
    }

    const result = await this.db
      .select()
      .from(benefits)
      .where(and(...conditions));
    return result;
  }

  async getBenefitsById(paramsId: number) {
    const result = await this.db
      .select()
      .from(benefits)
      .where(eq(benefits.benefits_id, paramsId));
    return result;
  }

  async deleteBenefits(paramsId: number): Promise<void> {
    await this.db
      .update(benefits)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(benefits.benefits_id, paramsId));
  }
}

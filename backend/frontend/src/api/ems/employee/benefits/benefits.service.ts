import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { benefits, SchemaType } from '@/drizzle/drizzle.schema';
import { and, eq, isNull } from 'drizzle-orm';
import { CreateBenefits, UpdateBenefits } from './benefits.model';

export class BenefitsService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createBenefits(data: CreateBenefits) {
    await this.db.insert(benefits).values(data);
  }

  async updateBenefits(
    data: UpdateBenefits,
    employee_id: string,
    benefits_id: string,
  ) {
    await this.db
      .update(benefits)
      .set(data)
      .where(
        and(
          eq(benefits.benefits_id, Number(benefits_id)),
          eq(benefits.employee_id, Number(employee_id)),
        ),
      );
  }

  async getAllBenefits(benefitTypes: string | undefined, employee_id: string) {
    const conditions = [
      isNull(benefits.deleted_at),
      eq(benefits.employee_id, Number(employee_id)),
    ];

    if (benefitTypes) {
      conditions.push(eq(benefits.benefits_type, benefitTypes));
    }

    const result = await this.db
      .select()
      .from(benefits)
      .where(and(...conditions));
    return result;
  }

  async getBenefitsById(benefits_id: string, employee_id: string) {
    const result = await this.db
      .select()
      .from(benefits)
      .where(
        and(
          eq(benefits.benefits_id, Number(benefits_id)),
          eq(benefits.employee_id, Number(employee_id)),
        ),
      );
    return result;
  }

  async deleteBenefits(benefits_id: string, employee_id: string) {
    await this.db
      .update(benefits)
      .set({ deleted_at: new Date(Date.now()) })
      .where(
        and(
          eq(benefits.benefits_id, Number(benefits_id)),
          eq(benefits.employee_id, Number(employee_id)),
        ),
      );
  }
}

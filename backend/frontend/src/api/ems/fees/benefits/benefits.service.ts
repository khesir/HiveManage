import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { benefits } from '@/drizzle/drizzle.schema';
import { eq } from 'drizzle-orm';

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

  async getAllBenefits(benefitTypes: string | undefined) {
    if (
      benefitTypes &&
      [
        'Table',
        'Shirt',
        'Mouse',
        'Salad',
        'Bacon',
        'Computer',
        'Keyboard',
        'Car',
        'Chicken',
        'Gloves',
        'Shoes',
        'Towels',
        'Tuna',
        'Pants',
        'Shorts',
        'Fish',
        'Salad',
        'Soap',
        'Chips',
        'Pizza',
        'Hat',
        'Ball',
      ].includes(benefitTypes)
    ) {
      const result = await this.db
        .select()
        .from(benefits)
        .where(
          eq(
            benefits.benefits_type,
            benefitTypes as
              | 'Table'
              | 'Shirt'
              | 'Mouse'
              | 'Salad'
              | 'Bacon'
              | 'Computer'
              | 'Keyboard'
              | 'Car'
              | 'Chicken'
              | 'Gloves'
              | 'Shoes'
              | 'Towels'
              | 'Tuna'
              | 'Pants'
              | 'Shorts'
              | 'Fish'
              | 'Salad'
              | 'Soap'
              | 'Chips'
              | 'Pizza'
              | 'Hat'
              | 'Ball',
          ),
        );
      return result;
    } else {
      const result = await this.db.select().from(benefits);
      return result;
    }
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

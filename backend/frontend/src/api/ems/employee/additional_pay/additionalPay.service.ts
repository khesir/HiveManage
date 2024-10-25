import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { additionalPay, SchemaType } from '@/drizzle/drizzle.schema';
import { eq, and, isNull } from 'drizzle-orm';
import {
  CreateAdditionalPay,
  UpdateAdditionalPay,
} from './additionalPay.model';

export class AdditionalPayService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createAdditionalPay(data: CreateAdditionalPay) {
    await this.db.insert(additionalPay).values(data);
  }

  async updateAdditionalPay(
    data: UpdateAdditionalPay,
    employee_id: string,
    additional_pay_id: string,
  ) {
    await this.db
      .update(additionalPay)
      .set(data)
      .where(
        and(
          eq(additionalPay.additional_pay_id, Number(additional_pay_id)),
          eq(additionalPay.employee_id, Number(employee_id)),
        ),
      );
  }

  async getAllAdditionalPay(employee_id: string) {
    const result = await this.db
      .select()
      .from(additionalPay)
      .where(
        and(
          eq(additionalPay.employee_id, Number(employee_id)),
          isNull(additionalPay.deleted_at),
        ),
      );
    return result;
  }

  async getAdditionalPayById(employee_id: string, additional_pay_id: string) {
    const result = await this.db
      .select()
      .from(additionalPay)
      .where(
        and(
          eq(additionalPay.employee_id, Number(employee_id)),
          eq(additionalPay.additional_pay_id, Number(additional_pay_id)),
          isNull(additionalPay.deleted_at),
        ),
      );
    return result;
  }

  async deleteAdditionalPay(employee_id: string, additional_pay_id: string) {
    await this.db
      .update(additionalPay)
      .set({ deleted_at: new Date(Date.now()) })
      .where(
        and(
          eq(additionalPay.employee_id, Number(employee_id)),
          eq(additionalPay.additional_pay_id, Number(additional_pay_id)),
        ),
      );
  }
}

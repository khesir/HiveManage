import { and, eq, isNull } from 'drizzle-orm';
import { employee_account, SchemaType } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class EmployeeAccountService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createEmployeeAccount(data: object) {
    await this.db.insert(employee_account).values(data);
  }

  async getAllEmployeeAccount(
    employee_account_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    try {
      if (employee_account_id) {
        const result = await this.db
          .select()
          .from(employee_account)
          .where(
            and(
              eq(
                employee_account.employee_account_id,
                Number(employee_account_id),
              ),
              isNull(employee_account.deleted_at),
            ),
          )
          .limit(limit)
          .offset(offset);
        return result;
      } else {
        const result = await this.db
          .select()
          .from(employee_account)
          .where(isNull(employee_account.deleted_at))
          .limit(limit)
          .offset(offset);
        return result;
      }
    } catch (error) {
      console.error('Error fetching employee account: ', error);
      throw new Error('Error fetching employee account');
    }
  }

  async getEmployeeAccountById(paramsId: number) {
    const result = await this.db
      .select()
      .from(employee_account)
      .where(eq(employee_account.employee_account_id, paramsId));
    return result[0];
  }

  async updateEmployeeAccount(data: object, paramsId: number) {
    await this.db
      .update(employee_account)
      .set(data)
      .where(eq(employee_account.employee_account_id, paramsId));
  }

  async deleteEmployeeAccount(paramsId: number): Promise<void> {
    await this.db
      .update(employee_account)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(employee_account.employee_account_id, paramsId));
  }
}

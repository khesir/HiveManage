import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { additionalPay } from 'drizzle/drizzle.schema';

export class AdditionalPayService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createAdditionalPay(data: object) {
    await this.db.insert(additionalPay).values(data);
  }
}

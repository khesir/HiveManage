import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { benefits } from '../../../../../drizzle/drizzle.schema';

export class BenefitsService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createBenefits(data: object) {
    await this.db.insert(benefits).values(data);
  }
}

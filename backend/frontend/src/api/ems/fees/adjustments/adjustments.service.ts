import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { adjustments } from '../../../../../drizzle/drizzle.schema';

export class AdjustmentsService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createAdjustments(data: object) {
    await this.db.insert(adjustments).values(data);
  }
}

import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { and, eq, isNull } from 'drizzle-orm';
import { reports } from '@/drizzle/drizzle.schema';

export class ReportsService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createReports(data: object) {
    await this.db.insert(reports).values(data);
  }

  async getAllReports(
    reports_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    try {
      if (reports_id) {
        const result = await this.db
          .select()
          .from(reports)
          .where(
            and(
              eq(reports.reports_id, Number(reports_id)),
              isNull(reports.deleted_at),
            ),
          )
          .limit(limit)
          .offset(offset);
        return result;
      } else {
        const result = await this.db
          .select()
          .from(reports)
          .where(isNull(reports.deleted_at))
          .limit(limit)
          .offset(offset);
        return result;
      }
    } catch (error) {
      console.error('Error fetching reports: ', error);
      throw new Error('Error fetching reports');
    }
  }

  async getReportsById(paramsId: number) {
    const result = await this.db
      .select()
      .from(reports)
      .where(eq(reports.reports_id, paramsId));
    return result[0];
  }

  async updateReports(data: object, paramsId: number) {
    await this.db
      .update(reports)
      .set(data)
      .where(eq(reports.reports_id, paramsId));
  }

  async deleteReports(paramsId: number): Promise<void> {
    await this.db
      .update(reports)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(reports.reports_id, paramsId));
  }
}

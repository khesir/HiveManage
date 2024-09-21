import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { and, eq, isNull } from 'drizzle-orm';
import { reserve } from '../../../../drizzle/drizzle.schema';

export class ReserveService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createReserve(data: object) {
    await this.db.insert(reserve).values(data);
  }

  async getAllReserve(
    reserve_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    try {
      if (reserve_id) {
        const result = await this.db
          .select()
          .from(reserve)
          .where(
            and(
              eq(reserve.reserve_id, Number(reserve_id)),
              isNull(reserve.deleted_at),
            ),
          )
          .limit(limit)
          .offset(offset);
        return result;
      } else {
        const result = await this.db
          .select()
          .from(reserve)
          .where(isNull(reserve.deleted_at))
          .limit(limit)
          .offset(offset);
        return result;
      }
    } catch (error) {
      console.error('Error fetching reserve: ', error);
      throw new Error('Error fetching reserves');
    }
  }

  async getReserveById(paramsId: number) {
    const result = await this.db
      .select()
      .from(reserve)
      .where(eq(reserve.reserve_id, paramsId));
    return result[0];
  }

  async updateReserve(data: object, paramsId: number) {
    await this.db
      .update(reserve)
      .set(data)
      .where(eq(reserve.reserve_id, paramsId));
  }

  async deleteReserve(paramsId: number): Promise<void> {
    await this.db
      .update(reserve)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(reserve.reserve_id, paramsId));
  }
}

import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { and, eq, isNull } from 'drizzle-orm';
import { service } from '../../../../drizzle/drizzle.schema';

export class ServicesService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createServices(data: object) {
    await this.db.insert(service).values(data);
  }

  async getAllServices(
    service_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    try {
      if (service_id) {
        const result = await this.db
          .select()
          .from(service)
          .where(
            and(
              eq(service.service_id, Number(service_id)),
              isNull(service.deleted_at),
            ),
          )
          .limit(limit)
          .offset(offset);
        return result;
      } else {
        const result = await this.db
          .select()
          .from(service)
          .where(isNull(service.deleted_at))
          .limit(limit)
          .offset(offset);
        return result;
      }
    } catch (error) {
      console.error('Error fetching services: ', error);
      throw new Error('Error fetching services');
    }
  }

  async getServicesById(paramsId: number) {
    const result = await this.db
      .select()
      .from(service)
      .where(eq(service.service_id, paramsId));
    return result[0];
  }

  async updateServices(data: object, paramsId: number) {
    await this.db
      .update(service)
      .set(data)
      .where(eq(service.service_id, paramsId));
  }

  async deleteServices(paramsId: number): Promise<void> {
    await this.db
      .update(service)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(service.service_id, paramsId));
  }
}

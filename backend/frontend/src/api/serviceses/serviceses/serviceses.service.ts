import { eq, isNull } from 'drizzle-orm';
import { sales, service } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateService } from './serviceses.model';

export class ServicesService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createServices(data: CreateService) {
    await this.db.insert(service).values(data);
  }

  async getAllServices(
    service_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(service.deleted_at)];
    if (service_id) {
      conditions.push(eq(service.service_id, Number(service_id)));
    }
    const result = await this.db
      .select()
      .from(service)
      .leftJoin(sales, eq(sales.sales_id, service.sales_id))
      .where(isNull(service.deleted_at))
      .limit(limit)
      .offset(offset);
    return result;
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

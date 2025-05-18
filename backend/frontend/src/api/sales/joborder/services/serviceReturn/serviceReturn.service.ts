import { SchemaType } from '@/drizzle/schema/type';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { service } from '@/drizzle/schema/services';
import {
  CreateServiceReturn,
  UpdateServiceReturn,
} from './serviceReturn.model';
import { serviceReturn } from '@/drizzle/schema/services/schema/service/serviceReturn.schema';

export class ServiceReturnService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }
  async createServiceReturn(data: CreateServiceReturn) {
    await this.db.insert(serviceReturn).values({
      ...data,
      returned_at: new Date(data.returned_at),
    });
  }
  async getAllServiceReturn(
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const condition = [isNull(serviceReturn.deleted_at)];

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(serviceReturn)
      .where(and(...condition));
    const totalData = totalCountQuery[0].count;
    const query = this.db
      .select()
      .from(serviceReturn)
      .leftJoin(
        service,
        eq(service.service_id, serviceReturn.original_service_id),
      )
      .where(and(...condition))
      .orderBy(
        sort === 'asc'
          ? asc(serviceReturn.return_id)
          : desc(serviceReturn.return_id),
      );
    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const serviceReturnWithDetails = result.map((row) => ({
      ...row.service_return,
      service: row.service,
    }));
    return { serviceReturnWithDetails, totalData };
  }
  async getServiceReturnById(ServiceReturn_id: number) {
    const result = await this.db
      .select()
      .from(serviceReturn)
      .leftJoin(
        service,
        eq(service.service_id, serviceReturn.original_service_id),
      )
      .where(eq(serviceReturn.return_id, Number(ServiceReturn_id)));

    const serviceReturnWithDetails = result.map((row) => ({
      ...row.service_return,
      service: row.service,
    }));
    return serviceReturnWithDetails;
  }
  async updateServiceReturn(data: UpdateServiceReturn, paramsId: number) {
    await this.db
      .update(serviceReturn)
      .set({
        ...data,
        returned_at: data.returned_at ? new Date(data.returned_at) : undefined,
      })
      .where(eq(serviceReturn.return_id, paramsId));
  }
  async deleteServiceReturn(paramsId: number) {
    await this.db
      .update(serviceReturn)
      .set({ deleted_at: new Date() })
      .where(eq(serviceReturn.return_id, paramsId));
  }
}

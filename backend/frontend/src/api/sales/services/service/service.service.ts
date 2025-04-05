import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { CreateService, UpdateService } from './service.model';
import { service, service_Type } from '@/drizzle/schema/services';

export class ServicesService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createServices(data: CreateService) {
    await this.db.insert(service).values(data);
  }

  async getAllServices(
    service_type_id: string | undefined,
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(service.deleted_at)];

    if (service_type_id) {
      conditions.push(eq(service.service_id, Number(service_type_id)));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(service)
      .leftJoin(
        service_Type,
        eq(service_Type.service_type_id, service.service_type_id),
      )
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(service)
      .leftJoin(
        service_Type,
        eq(service_Type.service_type_id, service.service_type_id),
      )
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(service.created_at) : desc(service.created_at),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const serviceWithDetails = result.map((row) => ({
      service_id: row.service.service_id,
      service_Type: {
        service_type: row.service_Type?.service_type_id,
        name: row.service_Type?.name,
        description: row.service_Type?.description,
        created_at: row.service_Type?.created_at,
        last_updated: row.service_Type?.last_updated,
        deleted_at: row.service_Type?.deleted_at,
      },
      uuid: row.service?.uuid,
      description: row.service?.description,
      fee: row.service?.fee,
      customer_id: row.service?.customer_id,
      service_status: row.service?.service_status,
      total_cost_price: row.service?.total_cost_price,
      created_at: row.service?.created_at,
      last_updated: row.service?.last_updated,
      deleted_at: row.service?.deleted_at,
    }));

    return { totalData, serviceWithDetails };
  }

  async getServiceById(service_id: number) {
    const result = await this.db
      .select()
      .from(service)
      .leftJoin(
        service_Type,
        eq(service_Type.service_type_id, service.service_type_id),
      )
      .where(eq(service.service_id, Number(service_id)));

    const serviceWithDetails = result.map((row) => ({
      service_id: row.service.service_id,
      service_Type: {
        service_type: row.service_Type?.service_type_id,
        name: row.service_Type?.name,
        description: row.service_Type?.description,
        created_at: row.service_Type?.created_at,
        last_updated: row.service_Type?.last_updated,
        deleted_at: row.service_Type?.deleted_at,
      },
      uuid: row.service?.uuid,
      description: row.service?.description,
      fee: row.service?.fee,
      customer_id: row.service?.customer_id,
      service_status: row.service?.service_status,
      total_cost_price: row.service?.total_cost_price,
      created_at: row.service?.created_at,
      last_updated: row.service?.last_updated,
      deleted_at: row.service?.deleted_at,
    }));

    return serviceWithDetails;
  }

  async updateService(data: UpdateService, paramsId: number) {
    await this.db
      .update(service)
      .set(data)
      .where(eq(service.service_id, paramsId));
  }

  async deleteService(paramsId: number): Promise<void> {
    await this.db
      .update(service)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(service.service_id, paramsId));
  }
}

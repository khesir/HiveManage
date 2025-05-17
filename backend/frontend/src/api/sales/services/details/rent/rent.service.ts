import { SchemaType } from '@/drizzle/schema/type';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateRent, UpdateRent } from './rent.model';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { rentDetails } from '@/drizzle/schema/services/schema/service/services/rentDetails.schema';
import { service } from '@/drizzle/schema/services';

export class RentService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }
  async createRent(data: CreateRent) {
    await this.db.insert(rentDetails).values({
      ...data,
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
      deposit:
        typeof data.deposit === 'string' ? Number(data.deposit) : data.deposit,
    });
  }
  async getAllRent(
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const condition = [isNull(rentDetails.deleted_at)];

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(rentDetails)
      .where(and(...condition));
    const totalData = totalCountQuery[0].count;
    const query = this.db
      .select()
      .from(rentDetails)
      .leftJoin(service, eq(service.service_id, rentDetails.service_id))
      .where(and(...condition))
      .orderBy(
        sort === 'asc' ? asc(rentDetails.rent_id) : desc(rentDetails.rent_id),
      );
    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const rentDetailsWithDetails = result.map((row) => ({
      ...row.rent_details,
      service: row.service,
    }));
    return { rentDetailsWithDetails, totalData };
  }
  async getRentById(rent_id: number) {
    const result = await this.db
      .select()
      .from(rentDetails)
      .leftJoin(service, eq(service.service_id, rentDetails.service_id))
      .where(eq(rentDetails.rent_id, Number(rent_id)));

    const rentDetailsWithDetails = result.map((row) => ({
      ...row.rent_details,
      service: row.service,
    }));
    return rentDetailsWithDetails;
  }
  async updateRent(data: UpdateRent, paramsId: number) {
    await this.db
      .update(rentDetails)
      .set({
        ...data,
        start_date: data.start_date ? new Date(data.start_date) : undefined,
        end_date: data.end_date ? new Date(data.end_date) : undefined,
        deposit:
          typeof data.deposit === 'string'
            ? Number(data.deposit)
            : data.deposit,
      })
      .where(eq(rentDetails.rent_id, paramsId));
  }
  async deleterent(paramsId: number) {
    await this.db
      .update(rentDetails)
      .set({ deleted_at: new Date() })
      .where(eq(rentDetails.rent_id, paramsId));
  }
}

import { SchemaType } from '@/drizzle/schema/type';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateCleaning, UpdateCleaning } from './cleaning.model';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { cleaningDetails } from '@/drizzle/schema/services/schema/service/services/cleaningDetails.schema';
import { service } from '@/drizzle/schema/services';

export class CleaningService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }
  async createCleaning(data: CreateCleaning) {
    await this.db.insert(cleaningDetails).values(data);
  }
  async getAllCleaning(
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const condition = [isNull(cleaningDetails.deleted_at)];

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(cleaningDetails)
      .where(and(...condition));
    const totalData = totalCountQuery[0].count;
    const query = this.db
      .select()
      .from(cleaningDetails)
      .leftJoin(service, eq(service.service_id, cleaningDetails.service_id))
      .where(and(...condition))
      .orderBy(
        sort === 'asc'
          ? asc(cleaningDetails.cleaning_id)
          : desc(cleaningDetails.cleaning_id),
      );
    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const cleaningDetailsWithDetails = result.map((row) => ({
      ...row.cleaning_details,
      service: row.service,
    }));
    return { cleaningDetailsWithDetails, totalData };
  }
  async getCleaningById(cleaning_id: number) {
    const result = await this.db
      .select()
      .from(cleaningDetails)
      .leftJoin(service, eq(service.service_id, cleaningDetails.service_id))
      .where(eq(cleaningDetails.cleaning_id, Number(cleaning_id)));

    const cleaningDetailsWithDetails = result.map((row) => ({
      ...row.cleaning_details,
      service: row.service,
    }));
    return cleaningDetailsWithDetails;
  }
  async updateCleaning(data: UpdateCleaning, paramsId: number) {
    await this.db
      .update(cleaningDetails)
      .set({ ...data })
      .where(eq(cleaningDetails.cleaning_id, paramsId));
  }
  async deleteCleaning(paramsId: number) {
    await this.db
      .update(cleaningDetails)
      .set({ deleted_at: new Date() })
      .where(eq(cleaningDetails.cleaning_id, paramsId));
  }
}

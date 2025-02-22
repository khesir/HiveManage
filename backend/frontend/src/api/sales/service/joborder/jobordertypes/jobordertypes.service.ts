import { eq, isNull } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateJobOrderTypes } from './jobordertypes.model';
import { jobOrderType } from '@/drizzle/schema/services';
import { SchemaType } from '@/drizzle/schema/type';

export class JobOrderTypeService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createJobOrderTypes(data: CreateJobOrderTypes) {
    await this.db.insert(jobOrderType).values(data);
  }

  async getAllJobOrderTypes(limit: number, offset: number) {
    const result = await this.db
      .select()
      .from(jobOrderType)
      .where(isNull(jobOrderType.deleted_at))
      .limit(limit)
      .offset(offset);
    return result;
  }

  async getJobOrderTypesById(paramsId: number) {
    const result = await this.db
      .select()
      .from(jobOrderType)
      .where(eq(jobOrderType.joborder_type_id, paramsId));
    return result[0];
  }

  async updateJobOrderTypes(data: object, paramsId: number) {
    await this.db
      .update(jobOrderType)
      .set(data)
      .where(eq(jobOrderType.joborder_type_id, paramsId));
  }

  async deleteJobOrderTypes(paramsId: number): Promise<void> {
    await this.db
      .update(jobOrderType)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(jobOrderType.joborder_type_id, paramsId));
  }
}

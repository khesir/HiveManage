import { eq, isNull } from 'drizzle-orm';
import { jobordertype, SchemaType } from '@/drizzle/drizzle.config';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateJobOrderTypes } from './jobordertypes.model';

export class JobOrderTypeService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createJobOrderTypes(data: CreateJobOrderTypes) {
    await this.db.insert(jobordertype).values(data);
  }

  async getAllJobOrderTypes(limit: number, offset: number) {
    const result = await this.db
      .select()
      .from(jobordertype)
      .where(isNull(jobordertype.deleted_at))
      .limit(limit)
      .offset(offset);
    return result;
  }

  async getJobOrderTypesById(paramsId: number) {
    const result = await this.db
      .select()
      .from(jobordertype)
      .where(eq(jobordertype.joborder_type_id, paramsId));
    return result[0];
  }

  async updateJobOrderTypes(data: object, paramsId: number) {
    await this.db
      .update(jobordertype)
      .set(data)
      .where(eq(jobordertype.joborder_type_id, paramsId));
  }

  async deleteJobOrderTypes(paramsId: number): Promise<void> {
    await this.db
      .update(jobordertype)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(jobordertype.joborder_type_id, paramsId));
  }
}

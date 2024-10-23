import { and, eq, isNull } from 'drizzle-orm';
import { jobordertype } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateJobOrderTypes } from './jobordertypes.model';

export class JobOrderTypeService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createJobOrderTypes(data: CreateJobOrderTypes) {
    await this.db.insert(jobordertype).values(data);
  }

  async getAllJobOrderTypes(
    joborder_type_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    try {
      if (joborder_type_id) {
        // Query by supplierId with limit and offset
        const result = await this.db
          .select()
          .from(jobordertype)
          .where(
            and(
              eq(jobordertype.joborder_type_id, Number(joborder_type_id)),
              isNull(jobordertype.deleted_at),
            ),
          )
          .limit(limit)
          .offset(offset);
        return result;
      } else {
        //Query all suppliers with limit and offset
        const result = await this.db
          .select()
          .from(jobordertype)
          .where(isNull(jobordertype.deleted_at))
          .limit(limit)
          .offset(offset);
        return result;
      }
    } catch (error) {
      console.error('Error fetching suppliers: ', error);
      throw new Error('Error fetching suppliers');
    }
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

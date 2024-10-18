import { and, eq, isNull } from 'drizzle-orm';
import { jobOrder } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateJobOrder } from './joborder.model';

export class JobOrderService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createJobOrder(data: CreateJobOrder) {
    await this.db.insert(jobOrder).values(data);
  }

  async getAllJobOrder(
    job_order_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    try {
      if (job_order_id) {
        const result = await this.db
          .select()
          .from(jobOrder)
          .where(
            and(
              eq(jobOrder.job_order_id, Number(job_order_id)),
              isNull(jobOrder.deleted_at),
            ),
          )
          .limit(limit)
          .offset(offset);
        return result;
      } else {
        const result = await this.db
          .select()
          .from(jobOrder)
          .where(isNull(jobOrder.deleted_at))
          .limit(limit)
          .offset(offset);
        return result;
      }
    } catch (error) {
      console.error('Error fetching job order: ', error);
      throw new Error('Error fetching job orders');
    }
  }

  async getJobOrderById(paramsId: number) {
    const result = await this.db
      .select()
      .from(jobOrder)
      .where(eq(jobOrder.job_order_id, paramsId));
    return result[0];
  }

  async updateJobOrder(data: object, paramsId: number) {
    await this.db
      .update(jobOrder)
      .set(data)
      .where(eq(jobOrder.job_order_id, paramsId));
  }

  async deleteJobOrder(paramsId: number): Promise<void> {
    await this.db
      .update(jobOrder)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(jobOrder.job_order_id, paramsId));
  }
}

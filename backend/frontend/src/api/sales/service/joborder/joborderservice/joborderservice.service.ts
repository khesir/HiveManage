import { and, eq, isNull, sql } from 'drizzle-orm';
import {
  jobOrder,
  joborder_services,
  jobordertype,
  SchemaType,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
  CreateJobOrderServicesService,
  UpdateJobOrderServicesService,
} from './joborderservice.model';

export class JobOrderServicesService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createJobOrderServices(data: CreateJobOrderServicesService) {
    await this.db.insert(joborder_services).values(data);
  }

  async getAllJobOrderServices(
    job_order_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(joborder_services.deleted_at)];

    if (job_order_id) {
      conditions.push(eq(joborder_services.job_order_id, Number(job_order_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(joborder_services)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(joborder_services)
      .leftJoin(
        jobordertype,
        eq(
          jobordertype.joborder_type_id,
          joborder_services.joborder_services_id,
        ),
      )
      .leftJoin(
        jobOrder,
        eq(jobOrder.job_order_id, joborder_services.joborder_services_id),
      )
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);

    const joborderserviceitemsWithDetails = result.map((row) => ({
      joborder_services_id: row.joborder_services.joborder_services_id,
      jobordertype: {
        joborder_type_id: row.jobordertype?.joborder_type_id,
        name: row.jobordertype?.name,
        description: row.jobordertype?.description,
        joborder_types_status: row.jobordertype?.joborder_types_status,
        fee: row.jobordertype?.fee,
        created_at: row.jobordertype?.created_at,
        last_updated: row.jobordertype?.last_updated,
        deleted_at: row.jobordertype?.deleted_at,
      },
      jobOrder: {
        job_order_id: row.joborder?.job_order_id,
        joborder_type_id: row.joborder?.joborder_type_id,
        service_id: row.joborder?.service_id,
        uuid: row.joborder?.uuid,
        fee: row.joborder?.fee,
        joborder_status: row.joborder?.joborder_status,
        total_cost_price: row.joborder?.total_cost_price,
        created_at: row.joborder?.created_at,
        last_updated: row.joborder?.last_updated,
        deleted_at: row.joborder?.deleted_at,
      },
      created_at: row.joborder_services?.created_at,
      last_updated: row.joborder_services?.last_updated,
      deleted_at: row.joborder_services?.deleted_at,
    }));

    return { totalData, joborderserviceitemsWithDetails };
  }

  async getJobOrderServicesById(joborder_services_id: number) {
    const result = await this.db
      .select()
      .from(joborder_services)
      .leftJoin(
        jobordertype,
        eq(
          jobordertype.joborder_type_id,
          joborder_services.joborder_services_id,
        ),
      )
      .leftJoin(
        jobOrder,
        eq(jobOrder.job_order_id, joborder_services.joborder_services_id),
      )
      .where(
        eq(
          joborder_services.joborder_services_id,
          Number(joborder_services_id),
        ),
      );

    const joborderserviceitemsWithDetails = result.map((row) => ({
      joborder_services_id: row.joborder_services.joborder_services_id,
      jobordertype: {
        joborder_type_id: row.jobordertype?.joborder_type_id,
        name: row.jobordertype?.name,
        description: row.jobordertype?.description,
        joborder_types_status: row.jobordertype?.joborder_types_status,
        fee: row.jobordertype?.fee,
        created_at: row.jobordertype?.created_at,
        last_updated: row.jobordertype?.last_updated,
        deleted_at: row.jobordertype?.deleted_at,
      },
      jobOrder: {
        job_order_id: row.joborder?.job_order_id,
        joborder_type_id: row.joborder?.joborder_type_id,
        service_id: row.joborder?.service_id,
        uuid: row.joborder?.uuid,
        fee: row.joborder?.fee,
        joborder_status: row.joborder?.joborder_status,
        total_cost_price: row.joborder?.total_cost_price,
        created_at: row.joborder?.created_at,
        last_updated: row.joborder?.last_updated,
        deleted_at: row.joborder?.deleted_at,
      },
      created_at: row.joborder_services?.created_at,
      last_updated: row.joborder_services?.last_updated,
      deleted_at: row.joborder_services?.deleted_at,
    }));

    return joborderserviceitemsWithDetails;
  }

  async updateJobOrderServices(
    data: UpdateJobOrderServicesService,
    paramsId: number,
  ) {
    await this.db
      .update(joborder_services)
      .set(data)
      .where(eq(joborder_services.joborder_services_id, paramsId));
  }

  async deleteJobOrderServices(paramsId: number): Promise<void> {
    await this.db
      .update(joborder_services)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(joborder_services.joborder_services_id, paramsId));
  }
}

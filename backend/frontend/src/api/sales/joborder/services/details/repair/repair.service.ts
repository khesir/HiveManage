import { SchemaType } from '@/drizzle/schema/type';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateRepair, UpdateRepair } from './repair.model';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { repairDetails } from '@/drizzle/schema/services/schema/service/services/repairDetails.schema';
import { service } from '@/drizzle/schema/services';

export class RepairService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }
  async createRepair(data: CreateRepair) {
    await this.db.insert(repairDetails).values(data);
  }
  async getAllRepair(
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const condition = [isNull(repairDetails.deleted_at)];

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(repairDetails)
      .where(and(...condition));
    const totalData = totalCountQuery[0].count;
    const query = this.db
      .select()
      .from(repairDetails)
      .leftJoin(service, eq(service.service_id, repairDetails.service_id))
      .where(and(...condition))
      .orderBy(
        sort === 'asc'
          ? asc(repairDetails.repair_details_id)
          : desc(repairDetails.repair_details_id),
      );
    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const repairDetailsWithDetails = result.map((row) => ({
      ...row.repair_details,
      service: row.service,
    }));
    return { repairDetailsWithDetails, totalData };
  }
  async getRepairById(repair_id: number) {
    const result = await this.db
      .select()
      .from(repairDetails)
      .leftJoin(service, eq(service.service_id, repairDetails.service_id))
      .where(eq(repairDetails.repair_details_id, Number(repair_id)));

    const repairDetailsWithDetails = result.map((row) => ({
      ...row.repair_details,
      service: row.service,
    }));
    return repairDetailsWithDetails;
  }
  async updateRepair(data: UpdateRepair, paramsId: number) {
    await this.db
      .update(repairDetails)
      .set({ ...data })
      .where(eq(repairDetails.repair_details_id, paramsId));
  }
  async deleteRepair(paramsId: number) {
    await this.db
      .update(repairDetails)
      .set({ deleted_at: new Date() })
      .where(eq(repairDetails.repair_details_id, paramsId));
  }
}

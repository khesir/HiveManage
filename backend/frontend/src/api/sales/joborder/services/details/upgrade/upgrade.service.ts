import { SchemaType } from '@/drizzle/schema/type';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateUpgrade, UpdateUpgrade } from './upgrade.model';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { service } from '@/drizzle/schema/services';
import { upgradeDetails } from '@/drizzle/schema/services/schema/service/services/upgradeDetails.schema';

export class UpgradeService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }
  async createUpgrade(data: CreateUpgrade) {
    await this.db.insert(upgradeDetails).values(data);
  }
  async getAllUpgrade(
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const condition = [isNull(upgradeDetails.deleted_at)];

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(upgradeDetails)
      .where(and(...condition));
    const totalData = totalCountQuery[0].count;
    const query = this.db
      .select()
      .from(upgradeDetails)
      .leftJoin(service, eq(service.service_id, upgradeDetails.service_id))
      .where(and(...condition))
      .orderBy(
        sort === 'asc'
          ? asc(upgradeDetails.upgrade_id)
          : desc(upgradeDetails.upgrade_id),
      );
    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const upgradeDetailsWithDetails = result.map((row) => ({
      ...row.upgrade_details,
      service: row.service,
    }));
    return { upgradeDetailsWithDetails, totalData };
  }
  async getUpgradeById(Upgrade_id: number) {
    const result = await this.db
      .select()
      .from(upgradeDetails)
      .leftJoin(service, eq(service.service_id, upgradeDetails.service_id))
      .where(eq(upgradeDetails.upgrade_id, Number(Upgrade_id)));

    const upgradeDetailsWithDetails = result.map((row) => ({
      ...row.upgrade_details,
      service: row.service,
    }));
    return upgradeDetailsWithDetails;
  }
  async updateUpgrade(data: UpdateUpgrade, paramsId: number) {
    await this.db
      .update(upgradeDetails)
      .set({ ...data })
      .where(eq(upgradeDetails.upgrade_id, paramsId));
  }
  async deleteUpgrade(paramsId: number) {
    await this.db
      .update(upgradeDetails)
      .set({ deleted_at: new Date() })
      .where(eq(upgradeDetails.upgrade_id, paramsId));
  }
}

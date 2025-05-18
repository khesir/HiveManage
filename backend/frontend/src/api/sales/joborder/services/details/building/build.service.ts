import { SchemaType } from '@/drizzle/schema/type';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { buildDetails } from '@/drizzle/schema/services/schema/service/services/buildDetails.schema';
import { service } from '@/drizzle/schema/services';
import { CreateBuild, UpdateBuild } from './build.model';

export class BuildService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }
  async createBuild(data: CreateBuild) {
    await this.db.insert(buildDetails).values(data);
  }
  async getAllBuild(
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const condition = [isNull(buildDetails.deleted_at)];

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(buildDetails)
      .where(and(...condition));
    const totalData = totalCountQuery[0].count;
    const query = this.db
      .select()
      .from(buildDetails)
      .leftJoin(service, eq(service.service_id, buildDetails.service_id))
      .where(and(...condition))
      .orderBy(
        sort === 'asc'
          ? asc(buildDetails.build_id)
          : desc(buildDetails.build_id),
      );
    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const buildDetailsWithDetails = result.map((row) => ({
      ...row.build_details,
      service: row.service,
    }));
    return { buildDetailsWithDetails, totalData };
  }
  async getBuildById(build_id: number) {
    const result = await this.db
      .select()
      .from(buildDetails)
      .leftJoin(service, eq(service.service_id, buildDetails.service_id))
      .where(eq(buildDetails.build_id, Number(build_id)));

    const buildDetailsWithDetails = result.map((row) => ({
      ...row.build_details,
      service: row.service,
    }));
    return buildDetailsWithDetails;
  }
  async updateBuild(data: UpdateBuild, paramsId: number) {
    await this.db
      .update(buildDetails)
      .set({ ...data })
      .where(eq(buildDetails.build_id, paramsId));
  }
  async deletebuild(paramsId: number) {
    await this.db
      .update(buildDetails)
      .set({ deleted_at: new Date() })
      .where(eq(buildDetails.build_id, paramsId));
  }
}

import { SchemaType } from '@/drizzle/schema/type';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateReplacement, UpdateReplacement } from './replacement.model';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { service } from '@/drizzle/schema/services';
import { replacementDetails } from '@/drizzle/schema/services/schema/service/services/replacementDetails.schema';
import { serviceLog } from '@/drizzle/schema/records/schema/serviceLog';

export class ReplacementService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }
  async createReplacement(data: CreateReplacement) {
    await this.db.insert(replacementDetails).values(data);

    await this.db.insert(serviceLog).values({
      service_id: data.service_id,
      action: 'Created Replacement Details',
      performed_by: data.user_id,
    });
  }
  async getAllReplacement(
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const condition = [isNull(replacementDetails.deleted_at)];

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(replacementDetails)
      .where(and(...condition));
    const totalData = totalCountQuery[0].count;
    const query = this.db
      .select()
      .from(replacementDetails)
      .leftJoin(service, eq(service.service_id, replacementDetails.service_id))
      .where(and(...condition))
      .orderBy(
        sort === 'asc'
          ? asc(replacementDetails.replacement_id)
          : desc(replacementDetails.replacement_id),
      );
    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const ReplacementDetailsWithDetails = result.map((row) => ({
      ...row.replacement_details,
      service: row.service,
    }));
    return { ReplacementDetailsWithDetails, totalData };
  }
  async getReplacementById(Replacement_id: number) {
    const result = await this.db
      .select()
      .from(replacementDetails)
      .leftJoin(service, eq(service.service_id, replacementDetails.service_id))
      .where(eq(replacementDetails.replacement_id, Number(Replacement_id)));

    const ReplacementDetailsWithDetails = result.map((row) => ({
      ...row.replacement_details,
      service: row.service,
    }));
    return ReplacementDetailsWithDetails;
  }
  async updateReplacement(data: UpdateReplacement, paramsId: number) {
    await this.db
      .update(replacementDetails)
      .set({ ...data })
      .where(eq(replacementDetails.replacement_id, paramsId));

    await this.db.insert(serviceLog).values({
      service_id: data.service_id,
      action: 'Created Replacement Details',
      performed_by: data.user_id,
    });
  }
  async deleteReplacement(paramsId: number, user_id: number) {
    await this.db
      .update(replacementDetails)
      .set({ deleted_at: new Date() })
      .where(eq(replacementDetails.replacement_id, paramsId));

    await this.db.insert(serviceLog).values({
      service_id: paramsId,
      action: 'Created Replacement Details',
      performed_by: user_id,
    });
  }
}

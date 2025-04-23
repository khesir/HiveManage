import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { SchemaType } from '@/drizzle/schema/type';
import { serviceLog } from '@/drizzle/schema/records/schema/serviceLog';
import { employee } from '@/drizzle/schema/ems';

export class ServiceLogService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createServiceLog(data: object) {
    await this.db.insert(serviceLog).values(data);
  }

  async getAllServiceLog(
    service_id: string | undefined,
    ticket_id: string | undefined,
    report_id: string | undefined,
    service_item_id: string | undefined,
    payment_id: string | undefined,
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(serviceLog.deleted_at)];

    if (service_id) {
      conditions.push(eq(serviceLog.service_id, Number(service_id)));
    }

    if (ticket_id) {
      conditions.push(eq(serviceLog.ticket_id, Number(ticket_id)));
    }

    if (report_id) {
      conditions.push(eq(serviceLog.report_id, Number(report_id)));
    }

    if (service_item_id) {
      conditions.push(eq(serviceLog.service_item_id, Number(service_item_id)));
    }

    if (payment_id) {
      conditions.push(eq(serviceLog.payment_id, Number(payment_id)));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(serviceLog)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(serviceLog)
      .leftJoin(employee, eq(employee.employee_id, serviceLog.performed_by))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(serviceLog.created_at)
          : desc(serviceLog.created_at),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const servicelogWithDetails = result.map((row) => ({
      ...row.serviceLog,
      performed_by: row.employee,
    }));

    return { totalData, servicelogWithDetails };
  }
}

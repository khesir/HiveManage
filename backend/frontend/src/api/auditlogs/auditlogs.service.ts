import { asc, desc, eq, isNull, and, sql, inArray } from 'drizzle-orm';

import { auditLog, employee, SchemaType } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { CreateAuditLog } from './auditlogs.model';

export class AuditLogService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createAuditLog(data: CreateAuditLog) {
    await this.db.insert(auditLog).values(data);
  }

  async getAllAuditLog(
    entity_type: string | undefined,
    employee_id: string | undefined,
    limit: number,
    sort: string,
    offset: number,
  ) {
    const conditions = [isNull(auditLog.deleted_at)];

    if (entity_type) {
      conditions.push(
        eq(
          auditLog.entity_type,
          entity_type as
            | 'Employee'
            | 'JobOrder'
            | 'Sales'
            | 'Service'
            | 'Inventory'
            | 'Order',
        ),
      );
    }
    if (employee_id) {
      const employeeIds: number[] = [];

      const employeeData = await this.db
        .select()
        .from(employee)
        .where(
          and(
            eq(employee.employee_id, Number(employee_id)),
            isNull(employee.deleted_at),
          ),
        );
      employeeIds.push(...employeeData.map((emp) => emp.employee_id));
      if (employeeIds.length > 0) {
        conditions.push(inArray(auditLog.employee_id, employeeIds));
      }
    }

    const totalCountQuery = await this.db
      .select({ count: sql<number>`COUNT(*)` })
      .from(auditLog)
      .where(and(...conditions));
    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(auditLog)
      .leftJoin(employee, eq(auditLog.employee_id, employee.employee_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(auditLog.created_at) : desc(auditLog.created_at),
      )
      .limit(limit)
      .offset(offset);

    const dataWithDetails = result.map((row) => ({
      activity_id: row.auditLog.auditlog_id,
      employee: {
        employee_id: row.employee?.employee_id,
        firstname: row.employee?.firstname,
        middlename: row.employee?.middlename,
        lastname: row.employee?.lastname,
        email: row.employee?.email,
        profile_link: row.employee?.profile_link,
        created_at: row.employee?.created_at,
        last_updated: row.employee?.last_updated,
        deleted_at: row.employee?.deleted_at,
      },
      entity_id: row.auditLog?.entity_id,
      entity_type: row.auditLog?.entity_type,
      action: row.auditLog?.action,
      created_at: row.auditLog.created_at,
      deleted_at: row.auditLog.deleted_at,
    }));
    return { totalData, dataWithDetails };
  }

  async getAuditLogById(paramsId: number) {
    const result = await this.db
      .select()
      .from(auditLog)
      .leftJoin(employee, eq(auditLog.employee_id, employee.employee_id))
      .where(eq(auditLog.auditlog_id, paramsId));
    const dataWithDetails = result.map((row) => ({
      activity_id: row.auditLog.auditlog_id,
      employee: {
        employee_id: row.employee?.employee_id,
        firstname: row.employee?.firstname,
        middlename: row.employee?.middlename,
        lastname: row.employee?.lastname,
        email: row.employee?.email,
        profile_link: row.employee?.profile_link,
        created_at: row.employee?.created_at,
        last_updated: row.employee?.last_updated,
        deleted_at: row.employee?.deleted_at,
      },
      entity_id: row.auditLog?.entity_id,
      entity_type: row.auditLog?.entity_type,
      action: row.auditLog?.action,
      created_at: row.auditLog.created_at,
      deleted_at: row.auditLog.deleted_at,
    }));
    return dataWithDetails;
  }

  async updateAuditLog(data: object, paramsId: number) {
    await this.db
      .update(auditLog)
      .set(data)
      .where(eq(auditLog.auditlog_id, paramsId));
  }

  async deleteAuditLog(paramsId: number): Promise<void> {
    await this.db
      .update(auditLog)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(auditLog.auditlog_id, paramsId));
  }
}

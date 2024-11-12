import { Request, Response, NextFunction } from 'express';

import { AuditLogService } from './auditlogs.service';
import { HttpStatus } from '@/lib/HttpStatus';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { SchemaType } from '@/drizzle/drizzle.schema';

export class AuditLogController {
  private auditLogService: AuditLogService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.auditLogService = new AuditLogService(pool);
  }

  async getAllAuditLogs(req: Request, res: Response, next: NextFunction) {
    const entity_type = (req.query.entity_type as string) || undefined;
    const employee_id = (req.query.employee_id as string) || undefined;

    const sort = (req.query.sort as string) || 'asc';
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    try {
      const data = await this.auditLogService.getAllAuditLog(
        entity_type,
        employee_id,
        limit,
        sort,
        offset,
      );
      res.status(200).json({
        status: HttpStatus.OK.status,
        limit: limit,
        offset: offset,
        total_data: data.totalData,
        data: data.dataWithDetails,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async getAuditLogsById(req: Request, res: Response, next: NextFunction) {
    try {
      const { auditlog_id } = req.params;
      const data = await this.auditLogService.getAuditLogById(
        Number(auditlog_id),
      );
      res.status(200).json({ message: data });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async createAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id, entity_id, entity_type, action, change } = req.body;

      await this.auditLogService.createAuditLog({
        employee_id,
        entity_id,
        entity_type,
        action,
        change,
      });
      res.status(HttpStatus.CREATED.code).json({
        message: 'Successfully Created Audit Logs',
        // data: id,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async updateAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const { auditlog_id } = req.params;
      const { employee_id, entity_id, entity_type, action, change } = req.body;

      await this.auditLogService.updateAuditLog(
        {
          employee_id,
          entity_id,
          entity_type,
          action,
          change,
        },
        Number(auditlog_id),
      );
      res.status(HttpStatus.OK.code).json({
        message: 'Audit Log Updated successfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }

  async deleteAuditLogbyID(req: Request, res: Response, next: NextFunction) {
    try {
      const { auditlog_id } = req.params;
      await this.auditLogService.deleteAuditLog(Number(auditlog_id));
      res.status(200).json({
        message: `Audit Log ID:${auditlog_id} is deleted successfully`,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
}

import { Request, Response, NextFunction } from 'express';

import { ActivityLogService } from './activitylogs.service';
import { HttpStatus } from '@/lib/HttpStatus';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';

export class ActivityLogController {
  private activityLogService: ActivityLogService;

  constructor(pool: PostgresJsDatabase) {
    this.activityLogService = new ActivityLogService(pool);
  }

  async getAllActivityLogs(req: Request, res: Response, next: NextFunction) {
    const sort = (req.query.sort as string) || 'asc';
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    const employee_id = Number(req.query.employee_id) || undefined;
    try {
      const data = await this.activityLogService.getAllActivityLogs(
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

  async getActivityLogById(req: Request, res: Response, next: NextFunction) {
    try {
      const { activity_id } = req.params;
      const data = await this.activityLogService.getActivityLogById(
        Number(activity_id),
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

  async createActivityLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id, action } = req.body;

      await this.activityLogService.createActivityLog({
        employee_id,
        action,
      });
      res.status(HttpStatus.CREATED.code).json({
        message: 'Succesfully Created Activity Logs',
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

  async updateActivityLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { activity_id } = req.params;
      const { employee_id, action } = req.body;

      await this.activityLogService.updateActivityLog(
        {
          employee_id,
          action,
        },
        Number(activity_id),
      );
      res.status(HttpStatus.OK.code).json({
        message: 'Activity Log Updated succesfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }

  async deleteActivityLogbyID(req: Request, res: Response, next: NextFunction) {
    try {
      const { activity_id } = req.params;
      await this.activityLogService.deleteActivityLog(Number(activity_id));
      res.status(200).json({
        message: `Activity Log ID:${activity_id} is deleted successfully`,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
}

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
    const limit = Number(req.query.limit) || 10; // Default limit to 10
    const sort = (req.query.sort as string) || 'asc'; // Default sort to 'asc'
    const page = Number(req.query.page) || 1;
    try {
      const activityLogs = await this.activityLogService.getAllActivityLogs({
        limit,
        sort,
        page,
      });
      res.status(200).json({ data: activityLogs });
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

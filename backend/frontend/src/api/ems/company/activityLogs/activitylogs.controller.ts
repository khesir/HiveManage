import { Request, Response, NextFunction } from 'express';

import { ActivityLogService } from './activitylogs.service';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { HttpStatus } from '../../../../../lib/HttpStatus';

export class ActivityLogController {
  private activityLogService: ActivityLogService;

  constructor(pool: MySql2Database) {
    this.activityLogService = new ActivityLogService(pool);
  }

  // Create a new activity log
  async createActivityLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id, action } = req.body;

      await this.activityLogService.createActivityLog({
        employee_id,
        action,
      });
      res.status(HttpStatus.CREATED.code).json({
        statusCode: 201,
        message: 'Succesfully Created Activity Logs',
        // data: id,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all activity logs
  async getAllActivityLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const activityLogs = await this.activityLogService.getAllActivityLogs();
      res.status(200).json({ statusCode: 200, data: activityLogs });
    } catch (error) {
      next(error);
    }
  }

  // Get an activity log by ID
  async getActivityLogById(req: Request, res: Response, next: NextFunction) {
    try {
      const { activity_id } = req.params;
      const data = await this.activityLogService.getActivityLogById(
        Number(activity_id),
      );
      res.status(200).json({ message: data });
    } catch (error) {
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
        statusCode: HttpStatus.OK.code,
        message: 'Activity Log Updated succesfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

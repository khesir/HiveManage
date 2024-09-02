import { Request, Response, NextFunction } from 'express';

import { ActivityLogService } from './activitylogs.service';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';

export class ActivityLogController {
  private activityLogService: ActivityLogService;

  constructor(pool: MySql2Database) {
    this.activityLogService = new ActivityLogService(pool);
  }

  // Create a new activity log
  async createActivityLog(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { employee_id, action } = req.body;
      const activityId = await this.activityLogService.createActivityLog({
        employee_id,
        action,
        activity_id: 0,
      });
      console.log(activityId);
    } catch (error) {
      next(error);
    }
  }

  // Get all activity logs
  async getAllActivityLogs(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const activityLogs = await this.activityLogService.getAllActivityLogs();
      res.json(activityLogs);
      res.json({ message: 'Sucess something' });
    } catch (error) {
      next(error);
    }
  }

  // Get an activity log by ID
  async getActivityLogById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { activity_id } = req.params;
      res.json(activity_id);
    } catch (error) {
      next(error);
    }
  }
}

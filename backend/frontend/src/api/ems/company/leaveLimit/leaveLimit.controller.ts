import { Request, Response, NextFunction } from 'express';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';

import { HttpStatus } from '@/lib/config';
import { LeaveLimitService } from './leaveLimit.service';

export class LeaveLimitController {
  private leaveLimitService: LeaveLimitService;

  constructor(pool: MySql2Database) {
    this.leaveLimitService = new LeaveLimitService(pool);
  }

  async getAllleaveLimit(req: Request, res: Response, next: NextFunction) {
    const employee_id = Number(req.query.employee_id) || undefined;
    try {
      const data = await this.leaveLimitService.getAllLeaveLimits(employee_id);
      res.status(HttpStatus.OK.code).json({ data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error' });
      next(error);
    }
  }

  async getleaveLimitById(req: Request, res: Response, next: NextFunction) {
    try {
      const { leaveLimit_id } = req.params;
      const data = await this.leaveLimitService.getLeaveLimitById(
        Number(leaveLimit_id),
      );

      res.status(HttpStatus.OK.code).send({ data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send({ message: 'Internal Server Error' });
      next(error);
    }
  }

  async createleaveLimit(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id, limit_count, leaveType } = req.body;
      await this.leaveLimitService.createLeaveLimit({
        employee_id,
        limit_count,
        leaveType,
      });
      res.status(HttpStatus.CREATED.code).json({
        message: 'Leave Limit Created successfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
  async updateleaveLimit(req: Request, res: Response, next: NextFunction) {
    try {
      const { leaveLimit_id } = req.params;
      const { employee_id, limit_count, leaveType } = req.body;
      await this.leaveLimitService.updateLeaveLimit(
        {
          employee_id,
          limit_count,
          leaveType,
        },
        Number(leaveLimit_id),
      );
      res.status(HttpStatus.OK.code).json({
        message: 'Leave Limit Updated succesfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
  async deleteleaveLimitByID(req: Request, res: Response, next: NextFunction) {
    try {
      const { leaveLimit_id } = req.params;
      await this.leaveLimitService.deleteLeaveLimit(Number(leaveLimit_id));
      res.status(200).json({
        message: `Leave Limit ID: ${leaveLimit_id} deleted successfully`,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
}

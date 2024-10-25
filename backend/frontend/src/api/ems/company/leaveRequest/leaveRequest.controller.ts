import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';

import { HttpStatus } from '@/lib/config';
import { LeaveRequestService } from './leaveRequest.service';
import { SchemaType } from '@/drizzle/drizzle.schema';

export class LeaveRequestController {
  private leaveRequestService: LeaveRequestService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.leaveRequestService = new LeaveRequestService(pool);
  }

  async getAllLeaveRequest(req: Request, res: Response, next: NextFunction) {
    const employee_id = Number(req.query.employee_id) || undefined;
    try {
      const data =
        await this.leaveRequestService.getAllLeaveRequests(employee_id);
      res.status(HttpStatus.OK.code).json({ data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error' });
      next(error);
    }
  }

  async getLeaveRequestById(req: Request, res: Response, next: NextFunction) {
    try {
      const { leaveRequest_id } = req.params;
      const data = await this.leaveRequestService.getLeaveRequestById(
        Number(leaveRequest_id),
      );

      res.status(HttpStatus.OK.code).send({ data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send({ message: 'Internal Server Error' });
      next(error);
    }
  }

  async createleaveRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        employee_id,
        title,
        content,
        date_of_leave,
        date_of_return,
        status,
        comment,
        leaveType,
      } = req.body;
      await this.leaveRequestService.createLeaveRequest({
        employee_id,
        title,
        content,
        date_of_leave,
        date_of_return,
        status,
        comment,
        leaveType,
      });
      res.status(HttpStatus.CREATED.code).json({
        message: 'Leave Request Created successfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
  async updateleaveRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { leaveRequest_id } = req.params;
      const {
        employee_id,
        title,
        content,
        date_of_leave,
        date_of_return,
        status,
        comment,
        leaveType,
      } = req.body;
      await this.leaveRequestService.updateLeaveRequest(
        {
          employee_id,
          title,
          content,
          date_of_leave,
          date_of_return,
          status,
          comment,
          leaveType,
        },
        Number(leaveRequest_id),
      );
      res.status(HttpStatus.OK.code).json({
        message: 'Leave Request Updated succesfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
  async deleteleaveRequestById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { leaveRequest_id } = req.params;
      await this.leaveRequestService.deleteLeaveRequest(
        Number(leaveRequest_id),
      );
      res.status(200).json({
        message: `Leave Request Id: ${leaveRequest_id} deleted successfully`,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
}

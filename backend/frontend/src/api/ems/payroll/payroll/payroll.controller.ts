import { Request, Response, NextFunction } from 'express';

import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { HttpStatus } from '@/lib/config';
import { PayrollService } from './payroll.service';

export class PayrollController {
  private payrollService: PayrollService;

  constructor(pool: MySql2Database) {
    this.payrollService = new PayrollService(pool);
  }

  async updatePayroll(req: Request, res: Response, next: NextFunction) {
    try {
      const { payroll_id } = req.params;
      const { start, end, pay_date, payroll_finished, approvalStatus } =
        req.body;

      await this.payrollService.updatePayrolls(
        {
          start,
          end,
          pay_date,
          payroll_finished,
          approvalStatus,
        },
        Number(payroll_id),
      );
      res.status(HttpStatus.OK.code).json({ message: 'Payroll Updated ' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }

  async createPayRoll(req: Request, res: Response, next: NextFunction) {
    try {
      const { start, end, pay_date, payroll_finished, approvalStatus } =
        req.body;

      await this.payrollService.createPayroll({
        start,
        end,
        pay_date,
        payroll_finished,
        approvalStatus,
      });
      res
        .status(HttpStatus.CREATED.code)
        .json({ message: 'Payroll Successfully Created' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async getAllPayroll(req: Request, res: Response, next: NextFunction) {
    const status = (req.query.status as string) || undefined;
    const sort = (req.query.sort as string) || 'asc';
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    try {
      const data = await this.payrollService.getAllPayroll(
        limit,
        sort,
        offset,
        status,
      );
      res.status(HttpStatus.OK.code).json({
        status: HttpStatus.OK.status,
        limit: limit,
        offset: offset,
        total_data: data.totalData,
        data: data.result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }

  async getPayrollId(req: Request, res: Response, next: NextFunction) {
    try {
      const { payroll_id } = req.params;
      const data = await this.payrollService.getPayrollById(Number(payroll_id));
      res.status(200).json({ message: data });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error ',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async deletePayrollById(req: Request, res: Response, next: NextFunction) {
    try {
      const { payroll_id } = req.params;
      await this.payrollService.deletePayroll(Number(payroll_id));
      res.status(200).json({
        message: `Payroll ID:${payroll_id} is deleted successfully`,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
}

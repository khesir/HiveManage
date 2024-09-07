import { Request, Response, NextFunction } from 'express';

import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { HttpStatus } from '../../../../../lib/config';
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
}

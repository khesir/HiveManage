import { Request, Response, NextFunction } from 'express';

import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { HttpStatus } from '../../../../../lib/config';
import { PayrollService } from './payroll.service';

export class PayrollController {
  private payrollService: PayrollService;

  constructor(pool: MySql2Database) {
    this.payrollService = new PayrollService(pool);
  }

  async getPayRollById(req: Request, res: Response, next: NextFunction) {
    try {
      const { payroll_id } = req.params;
      const data = await this.payrollService.getPayrollById(Number(payroll_id));
      res.status(200).json({ message: data });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async createPayRoll(req: Request, res: Response, next: NextFunction) {
    try {
      const { payroll_id, action } = req.body;

      await this.payrollService.createPayroll({
        payroll_id,
        action,
      });
      res
        .status(HttpStatus.CREATED.code)
        .json({ message: 'Successfully Created Payroll' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }
}

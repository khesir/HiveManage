import { Request, Response, NextFunction } from 'express';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { OnPayrollService } from './onPayroll.service';
import { HttpStatus } from '../../../../../lib/config';

export class OnPayrollController {
  private onPayrollService: OnPayrollService;

  constructor(pool: MySql2Database) {
    this.onPayrollService = new OnPayrollService(pool);
  }

  async createOnPayroll(req: Request, res: Response, next: NextFunction) {
    try {
      const { employees } = req.body;
      console.log(employees);
      await this.onPayrollService.createOnPayroll(employees);
      res
        .status(HttpStatus.CREATED.code)
        .json({ message: `${employees.length} Employee Added to payroll` });
    } catch (error) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST.code).json({
          message: error.message,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
          message: 'Internal Server Error',
        });
        next(error);
      }
    }
  }
}

import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { OnPayrollService } from './onPayroll.service';
import { HttpStatus } from '@/lib/config';
import { SchemaType } from '@/drizzle/drizzle.schema';

export class OnPayrollController {
  private onPayrollService: OnPayrollService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.onPayrollService = new OnPayrollService(pool);
  }

  async getAllOnPayroll(req: Request, res: Response, next: NextFunction) {
    try {
      const { payroll_id } = req.params;

      const result = await this.onPayrollService.getAllOnPayroll(
        Number(payroll_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: HttpStatus.OK.code,
        data: result,
      });
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

  async createOnPayroll(req: Request, res: Response, next: NextFunction) {
    try {
      const { employees } = req.body;
      const { payroll_id } = req.query || undefined;
      if (payroll_id === undefined) {
        throw new Error(
          `payroll_id doesn't exists, kindly provide the payroll_id as query parameter`,
        );
      }
      await this.onPayrollService.createOnPayroll(
        employees,
        Number(payroll_id),
      );
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
  async updateOnpayroll(req: Request, res: Response, next: NextFunction) {
    try {
      const { payroll_id } = req.query || undefined;
      const { toDeleteEmployee, toAddEmployee } = req.body;
      if (payroll_id === undefined) {
        throw new Error(
          `payroll_id doesn't exists, kindly provide the payroll_id as query parameter`,
        );
      }
      const { message } = await this.onPayrollService.updateOnPayroll(
        toAddEmployee === undefined ? [] : toAddEmployee,
        toDeleteEmployee === undefined ? [] : toDeleteEmployee,
        Number(payroll_id),
      );
      res.status(HttpStatus.OK.code).json({
        message: message,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
}

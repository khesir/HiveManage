import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/drizzle.schema';
import { EmployeeAccountService } from './employeeaccount.service';

export class EmployeeAccountController {
  private employeeaccountservice: EmployeeAccountService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.employeeaccountservice = new EmployeeAccountService(pool);
  }

  async getAllEmployeeAccount(req: Request, res: Response, next: NextFunction) {
    const employee_account_id =
      (req.query.employee_account_id as string) || undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.employeeaccountservice.getAllEmployeeAccount(
        employee_account_id,
        limit,
        offset,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.length,
        limit: limit,
        offset: offset,
        data: data,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getEmployeeAccountById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { employee_account_id } = req.params;
      const data = await this.employeeaccountservice.getEmployeeAccountById(
        Number(employee_account_id),
      );
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createEmployeeAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id, account_name, password, salt } = req.body;

      await this.employeeaccountservice.createEmployeeAccount({
        employee_id,
        account_name,
        password,
        salt, // Convert true/false to 1/0 before passing to the service
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Employee Account ',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        status: 'Error ',
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async updateEmployeeAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_account_id } = req.params;
      const { employee_id, account_name, password, salt } = req.body;

      await this.employeeaccountservice.updateEmployeeAccount(
        {
          employee_id,
          account_name,
          password,
          salt,
        },
        Number(employee_account_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Employee Account Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteEmployeeAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_account_id } = req.params;
      await this.employeeaccountservice.deleteEmployeeAccount(
        Number(employee_account_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Employee Account ID:${employee_account_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

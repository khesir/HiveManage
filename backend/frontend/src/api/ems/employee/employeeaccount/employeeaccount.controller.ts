import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/drizzle.schema';
import { EmployeeAccountService } from './employeeaccount.service';

export class EmployeeAccountController {
  private employeeaccountService: EmployeeAccountService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.employeeaccountService = new EmployeeAccountService(pool);
  }

  async getAllEmployeeAccount(req: Request, res: Response, next: NextFunction) {
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const employee_role_id =
      (req.query.employee_role_id as string) || undefined;

    try {
      const data = await this.employeeaccountService.getAllEmployeeAccount(
        sort,
        limit,
        offset,
        employee_role_id,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.totalData,
        limit: limit,
        offset: offset,
        data: data.employeeaccountWithDetails,
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
      const data =
        await this.employeeaccountService.getEmployeeAccountById(
          employee_account_id,
        );
      res.status(200).json({ message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createEmployeeAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        employee_id,
        employee_role_id,
        account_name,
        email,
        salt,
        password,
      } = req.body;

      await this.employeeaccountService.createEmployeeAccount({
        employee_id,
        employee_role_id,
        account_name,
        email,
        salt,
        password,
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
      const {
        employee_id,
        employee_role_id,
        account_name,
        email,
        salt,
        password,
      } = req.body;

      await this.employeeaccountService.updateEmployeeAccount(
        {
          employee_id,
          employee_role_id,
          account_name,
          email,
          salt,
          password,
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
      await this.employeeaccountService.deleteEmployeeAccount(
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

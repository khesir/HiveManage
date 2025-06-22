import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';

import { HttpStatus } from '@/lib/config';
import { EmployeeService } from './employee.service';
import { SchemaType } from '@/drizzle/schema/type';

export class EmployeeController {
  private employeeService: EmployeeService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.employeeService = new EmployeeService(pool);
  }

  async getAllEmployee(req: Request, res: Response, next: NextFunction) {
    const sort = (req.query.sort as string) || 'asc';
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    const fullname = (req.query.fullname as string) || undefined;
    const no_pagination = req.query.no_pagination === 'true';
    try {
      const data = await this.employeeService.getAllEmployee(
        limit,
        sort,
        offset,
        fullname,
        no_pagination,
      );
      res.status(HttpStatus.OK.code).json({
        status: HttpStatus.OK.status,
        limit: limit,
        offset: offset,
        total_data: data.totalData,
        data: data.employeeWithRelatedData,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error' });
      next(error);
    }
  }

  async getEmployeeById(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id } = req.params;
      const data = await this.employeeService.getEmployeeById(
        Number(employee_id),
      );

      res.status(HttpStatus.OK.code).send({ data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send({ message: 'Internal Server Error' });
      next(error);
    }
  }

  async createEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const { position_id, firstname, middlename, lastname, email } = req.body;
      await this.employeeService.createEmployee({
        firstname,
        middlename,
        lastname,
        email,
        position_id,
      });
      res.status(HttpStatus.CREATED.code).json({
        message: 'Employee Created successfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
  async updateEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id } = req.params;
      const {
        remove_image,
        position_id,
        role_id,
        firstname,
        middlename,
        lastname,
        email,
      } = req.body;

      await this.employeeService.updateEmployee(
        Number(employee_id),
        {
          remove_image,
          firstname,
          middlename,
          lastname,
          email,
          position_id,
          role_id,
        },
        req.file,
      );
      res.status(HttpStatus.OK.code).json({
        message: 'Employee Updated successfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
  async deleteEmployeeById(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id } = req.params;
      await this.employeeService.deleteEmployeeById(Number(employee_id));
      res.status(200).json({
        message: `Employee Id: ${employee_id} deleted successfully`,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
}

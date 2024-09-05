import { Request, Response, NextFunction } from 'express';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';

import { HttpStatus } from '../../../../../lib/config';
import { EmployeeService } from './employee.service';

export class EmployeeController {
  private employeeService: EmployeeService;

  constructor(pool: MySql2Database) {
    this.employeeService = new EmployeeService(pool);
  }

  async getAllEmployee(req: Request, res: Response, next: NextFunction) {
    const status = (req.query.status as string) || undefined;
    try {
      const data = await this.employeeService.getAllEmployee(status);
      res.status(HttpStatus.OK.code).json({ data: data });
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
      // const { uuid, firstname, middlename, lastname, status } = req.body;
      console.log(req.body);
      // await this.employeeService.createEmployee({
      //   uuid,
      //   firstname,
      //   middlename,
      //   lastname,
      //   status,
      // });
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
      const { uuid, firstname, middlename, lastname, status } = req.body;

      await this.employeeService.updateEmployee(
        {
          uuid,
          firstname,
          middlename,
          lastname,
          status,
        },
        Number(employee_id),
      );
      res.status(HttpStatus.OK.code).json({
        message: 'Employee Updated succesfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
  async deleteEmployeeByID(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id } = req.params;
      await this.employeeService.deleteEmployeeByID(Number(employee_id));
      res.status(200).json({
        message: `Employee ID: ${employee_id} deleted successfully`,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
}

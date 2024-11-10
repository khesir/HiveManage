import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/drizzle.schema';
import { EmployeeRolesService } from './employeeRoles.service';

export class EmployeeRolesController {
  private employeeaccountService: EmployeeRolesService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.employeeaccountService = new EmployeeRolesService(pool);
  }

  async getAllEmployeeAccount(req: Request, res: Response, next: NextFunction) {
    const sort = (req.query.sort as string) || 'desc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const role_id = (req.query.role_id as string) || undefined;
    const user_id = (req.query.user_id as string) || undefined;
    const fullname = (req.query.fullname as string) || undefined;
    const status = (req.query.status as string) || undefined;
    const employee_id = (req.query.employee_id as string) || undefined;
    try {
      const data = await this.employeeaccountService.getAllEmployeeAccount(
        sort,
        limit,
        offset,
        status,
        role_id,
        employee_id,
        user_id,
        fullname,
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
      const { employee_role_id } = req.params;
      const data =
        await this.employeeaccountService.getEmployeeAccountById(
          employee_role_id,
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
        employee_position_id,
        employee_firstname,
        employee_middlename,
        employee_lastname,
        employee_email,
        personal_information_birthday,
        personal_information_sex,
        personal_information_phone,
        personal_information_address_line,
        personal_information_postal_code,
        employment_information_department_id,
        employment_information_designation_id,
        employment_information_employee_type,
        employment_information_employee_status,
        employee_role_role_id,
      } = req.body;
      console.log(req.body);
      await this.employeeaccountService.createEmployeeAccount(
        {
          employee_position_id,
          employee_firstname,
          employee_middlename,
          employee_lastname,
          employee_email,
          personal_information_birthday,
          personal_information_sex,
          personal_information_phone,
          personal_information_address_line,
          personal_information_postal_code,
          employment_information_department_id,
          employment_information_designation_id,
          employment_information_employee_type,
          employment_information_employee_status,
          employee_role_role_id,
        },
        req.file,
      );
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
      const { employee_role_id } = req.params;
      const {
        employee_position_id,
        employee_firstname,
        employee_middlename,
        employee_lastname,
        employee_email,
        personal_information_birthday,
        personal_information_sex,
        personal_information_phone,
        personal_information_address_line,
        personal_information_postal_code,
        employment_information_department_id,
        employment_information_designation_id,
        employment_information_employee_type,
        employment_information_employee_status,
        employee_role_role_id,
      } = req.body;

      await this.employeeaccountService.updateEmployeeAccount(
        {
          employee_position_id,
          employee_firstname,
          employee_middlename,
          employee_lastname,
          employee_email,
          personal_information_birthday,
          personal_information_sex,
          personal_information_phone,
          personal_information_address_line,
          personal_information_postal_code,
          employment_information_department_id,
          employment_information_designation_id,
          employment_information_employee_type,
          employment_information_employee_status,
          employee_role_role_id,
        },
        employee_role_id,
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

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_role_id } = req.params;
      const status = req.body.status;
      await this.employeeaccountService.updateStatus(
        { status },
        employee_role_id,
      );
      res.status(200).json({
        status: 'Success',
        message: `Employee Account ID:${employee_role_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }

  async deleteEmployeeAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_role_id } = req.params;
      await this.employeeaccountService.deleteEmployeeAccount(
        Number(employee_role_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Employee Account ID:${employee_role_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { AssignedEmployeeService } from './assignedemployees.service';
import { SchemaType } from '@/drizzle/schema/type';

export class AssignedEmployeeController {
  private assignedemployeeService: AssignedEmployeeService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.assignedemployeeService = new AssignedEmployeeService(pool);
  }

  async getAllAssignedEmployee(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { job_order_id } = req.params || undefined;
      const employee_id = (req.query.employee_id as string) || undefined;
      const data = await this.assignedemployeeService.getAllAssignedEmployee(
        job_order_id,
        employee_id,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        data: data,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getAssignedEmployeeById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { assigned_employee_id } = req.params;
      const data =
        await this.assignedemployeeService.getAssignEmployeeByID(
          assigned_employee_id,
        );
      res.status(200).json({ status: 'Success', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createAssignedEmployee(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const job_order_id = Number(req.params.job_order_id);
      const { employee_id, assigned_by } = req.body;

      await this.assignedemployeeService.createAssignedEmployees({
        job_order_id,
        employee_id,
        assigned_by,
        is_leader: false,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Assigned Employees ',
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

  async updateAssignedEmployee(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { assigned_employee_id } = req.params;
      const { job_order_id, employee_id, assigned_by } = req.body;

      await this.assignedemployeeService.updateAssignedEmployees(
        { job_order_id, employee_id, assigned_by },
        Number(assigned_employee_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Assigned Employees Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteAssignedEmployee(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { assigned_employee_id } = req.params;
      await this.assignedemployeeService.deleteAssignedEmployee(
        Number(assigned_employee_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Assigned Employee ID:${assigned_employee_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

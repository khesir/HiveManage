import { Request, Response, NextFunction } from 'express';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';

import { HttpStatus } from '@/lib/config';
import { DepartmentService } from './department.service';

export class DepartmentController {
  private departmentService: DepartmentService;

  constructor(pool: MySql2Database) {
    this.departmentService = new DepartmentService(pool);
  }

  async getAllDepartments(req: Request, res: Response, next: NextFunction) {
    const status = (req.query.status as string) || undefined;
    try {
      const departments =
        await this.departmentService.getAllDepartments(status);
      res.status(HttpStatus.OK.code).json({ data: departments });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }

  async getDepartmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { department_id } = req.params;
      const data = await this.departmentService.getDepartmentById(
        Number(department_id),
      );
      res.status(HttpStatus.OK.code).json({ data: data });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }

  async createDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, status } = req.body;
      await this.departmentService.createDepartment({
        name,
        status,
      });
      res.status(HttpStatus.CREATED.code).json({
        message: 'Department Created',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
  async updateDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      const { department_id } = req.params;
      const { name, status } = req.body;
      await this.departmentService.updateDepartment(
        { name, status },
        Number(department_id),
      );
      res.status(HttpStatus.OK.code).json({
        message: 'Department Updated succesfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
  async deleteDepartmentByID(req: Request, res: Response, next: NextFunction) {
    try {
      const { department_id } = req.params;
      await this.departmentService.deleteDepartment(Number(department_id));
      res.status(200).json({
        message: `Department ID: ${department_id} deleted successfully`,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
}

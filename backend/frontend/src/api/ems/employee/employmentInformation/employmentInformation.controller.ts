import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';

import { HttpStatus } from '@/lib/config';
import { EmploymentInformationService } from './employmentInformation.service';
import { SchemaType } from '@/drizzle/drizzle.schema';

export class EmploymentInformationController {
  private employmentInformationService: EmploymentInformationService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.employmentInformationService = new EmploymentInformationService(pool);
  }

  async getEmploymentInformation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { employment_id, employee_id } = req.params;
      const result =
        await this.employmentInformationService.getEmploymentInformation(
          Number(employment_id),
          Number(employee_id),
        );

      res.status(HttpStatus.OK.code).json({
        status: HttpStatus.OK.status,
        data: result,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send({ message: 'Internal Server Error' });
      next(error);
    }
  }
  async createEmploymentInformation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const {
        department_id,
        designation_id,
        employee_type,
        employee_status,
        message,
      } = req.body;

      await this.employmentInformationService.createEmploymentInformation({
        department_id,
        designation_id,
        employee_type,
        employee_status,
        message,
      });
      res.status(HttpStatus.OK.code).json({
        message: 'Employment Information created successfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
  async updateEmploymentInformation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { employment_id } = req.params;
      const {
        department_id,
        designation_id,
        employee_type,
        employee_status,
        message,
      } = req.body;
      await this.employmentInformationService.updateEmploymentInformation(
        Number(employment_id),
        {
          department_id,
          designation_id,
          employee_type,
          employee_status,
          message,
        },
      );
      res.status(HttpStatus.OK.code).json({
        message: 'Employment Information Updated successfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
  async deleteEmploymentInformation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { employment_id } = req.params;
      await this.employmentInformationService.deleteEmployementInformation(
        Number(employment_id),
      );
      res
        .status(HttpStatus.OK.code)
        .json({ message: 'Employment Information deleted successfully' });
    } catch (error) {
      res.status(HttpStatus.OK.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
}

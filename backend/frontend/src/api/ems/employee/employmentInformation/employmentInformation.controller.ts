import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';

import { HttpStatus } from '@/lib/config';
import { EmploymentInformationService } from './employmentInformation.service';
import { SchemaType } from '@/drizzle/schema/type';

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
      const { employee_id, employment_id } = req.params;
      const result =
        await this.employmentInformationService.getEmploymentInformation(
          employment_id,
          employee_id,
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
      const { employee_id } = req.params;
      const { department_id, designation_id, employee_type, employee_status } =
        req.body;

      await this.employmentInformationService.createEmploymentInformation(
        Number(employee_id),
        {
          department_id,
          designation_id,
          employee_type,
          employee_status,
        },
      );
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
      const { department_id, designation_id, employee_type, employee_status } =
        req.body;
      await this.employmentInformationService.updateEmploymentInformation(
        Number(employment_id),
        {
          department_id,
          designation_id,
          employee_type,
          employee_status,
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
      const { employee_id } = req.params;
      await this.employmentInformationService.deleteEmployementInformation(
        Number(employee_id),
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

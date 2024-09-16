import { Request, Response, NextFunction } from 'express';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';

import { HttpStatus } from '../../../../../lib/config';
import { EmploymentInformationService } from './employmentInformation.service';

export class EmploymentInformationController {
  private employmentInformationService: EmploymentInformationService;

  constructor(pool: MySql2Database) {
    this.employmentInformationService = new EmploymentInformationService(pool);
  }

  async getEmploymentInformation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { employment_id } = req.params;
      const { employee_id } = req.params;
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
        employee_id,
        department_id,
        designation_id,
        employee_type,
        employee_status,
      } = req.body;
      await this.employmentInformationService.createEmploymentInformation({
        employee_id,
        department_id,
        designation_id,
        employee_type,
        employee_status,
      });
      res.status(HttpStatus.OK.code).json({
        message: 'Employment Information created succesfully',
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
        employee_id,
        department_id,
        designation_id,
        employee_type,
        employee_status,
      } = req.body;
      await this.employmentInformationService.updateEmploymentInformation(
        {
          employee_id,
          department_id,
          designation_id,
          employee_type,
          employee_status,
        },
        Number(employment_id),
      );
      res.status(HttpStatus.OK.code).json({
        message: 'Employment Information Updated succesfully',
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
        .json({ message: 'Employment Information deleted succesfully' });
    } catch (error) {
      res.status(HttpStatus.OK.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
}

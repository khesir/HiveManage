import { Request, Response, NextFunction } from 'express';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';

import { HttpStatus } from '../../../../../lib/config';
import { SalaryInformationService } from './salaryInformation.service';

export class SalaryInformationController {
  private salaryInformationService: SalaryInformationService;

  constructor(pool: MySql2Database) {
    this.salaryInformationService = new SalaryInformationService(pool);
  }

  async getPersonalIDByEmployeeID(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { employee_id } = req.query;
      const data =
        await this.salaryInformationService.getSalaryInformationByEmployeeID(
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

  async updatePersonalInformation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { salaryInfo_id } = req.params;
      const { employee_id, payroll_frequency, base_salary } = req.body;
      await this.salaryInformationService.updateSalaryInformation(
        {
          employee_id,
          payroll_frequency,
          base_salary,
        },
        Number(salaryInfo_id),
      );
      res.status(HttpStatus.OK.code).json({
        message: 'Salary Information Updated succesfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
}

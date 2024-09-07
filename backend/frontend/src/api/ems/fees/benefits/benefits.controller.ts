import { Request, Response, NextFunction } from 'express';

import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { HttpStatus } from '../../../../../lib/config';
import { BenefitsService } from './benefits.service';

export class BenefitsController {
  private benefitService: BenefitsService;

  constructor(pool: MySql2Database) {
    this.benefitService = new BenefitsService(pool);
  }

  async createBenefit(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id, start, end, benefits_type, amount, description } =
        req.body;

      await this.benefitService.createBenefits({
        employee_id,
        start,
        end,
        benefits_type,
        amount,
        description,
      });
      res
        .status(HttpStatus.CREATED.code)
        .json({ message: 'Benefit Successfully Created' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }
}

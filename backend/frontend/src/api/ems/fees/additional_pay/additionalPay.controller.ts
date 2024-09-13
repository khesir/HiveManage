import { Request, Response, NextFunction } from 'express';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';

import { HttpStatus } from '../../../../../lib/config';
import { AdditionalPayService } from './additionalPay.service';

export class AdditionalPayController {
  private additionalPayService: AdditionalPayService;

  constructor(pool: MySql2Database) {
    this.additionalPayService = new AdditionalPayService(pool);
  }

  async createAdditionalPay(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id, additional_pay_type, amount, description } =
        req.body;
      await this.additionalPayService.createAdditionalPay({
        employee_id,
        additional_pay_type,
        amount,
        description,
      });
      res
        .status(HttpStatus.CREATED.code)
        .json({ message: 'Additional Pay Successfully Created ' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error ',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }
}

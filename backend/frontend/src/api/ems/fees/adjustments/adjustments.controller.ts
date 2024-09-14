import { Request, Response, NextFunction } from 'express';

import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { HttpStatus } from '../../../../../lib/config';
import { AdjustmentsService } from './adjustments.service';

export class AdjustmentsController {
  private adjustmentsService: AdjustmentsService;

  constructor(pool: MySql2Database) {
    this.adjustmentsService = new AdjustmentsService(pool);
  }

  async createAdjustments(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id, remarks, adjustment_type, amount, description } =
        req.body;

      await this.adjustmentsService.createAdjustments({
        employee_id,
        remarks,
        adjustment_type,
        amount,
        description,
      });
      res
        .status(HttpStatus.CREATED.code)
        .json({ message: 'Adjustments Successfully Created' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error ',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }
}

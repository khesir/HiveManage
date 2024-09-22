import { Request, Response, NextFunction } from 'express';

import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { HttpStatus } from '@/lib/config';
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

  async updateAdjustments(req: Request, res: Response, next: NextFunction) {
    try {
      const { adjustments_id } = req.params;
      const { employee_id, remarks, adjustment_type, amount, description } =
        req.body;

      await this.adjustmentsService.updateAdjustments(
        {
          employee_id,
          remarks,
          adjustment_type,
          amount,
          description,
        },
        Number(adjustments_id),
      );
      res
        .status(HttpStatus.OK.code)
        .json({ message: 'Adjustments Updated Successfully' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error' });
      next(error);
    }
  }

  async getAllAdjustments(req: Request, res: Response, next: NextFunction) {
    try {
      const { additional_pay_id } = req.params;
      const { employee_id } = req.query;
      const result = await this.adjustmentsService.getAllAdjustments(
        Number(additional_pay_id),
        Number(employee_id),
      );
      res.status(HttpStatus.OK.code).json({ data: result });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getAdjustmentsById(req: Request, res: Response, next: NextFunction) {
    try {
      const { adjustments_id } = req.params;
      const data = await this.adjustmentsService.getAdjustmentsById(
        Number(adjustments_id),
      );
      res.status(200).json({ message: data });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error ',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async deleteAdjustmentsById(req: Request, res: Response, next: NextFunction) {
    try {
      const { adjustments_id } = req.params;
      await this.adjustmentsService.deleteAdjustments(Number(adjustments_id));
      res.status(200).json({
        message: `Adjustments ID:${adjustments_id} is deleted successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }
}

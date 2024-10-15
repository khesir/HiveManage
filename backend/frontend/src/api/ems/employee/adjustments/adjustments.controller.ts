import { Request, Response, NextFunction } from 'express';

import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { HttpStatus } from '@/lib/config';
import { AdjustmentsService } from './adjustments.service';

export class AdjustmentsController {
  private adjustmentsService: AdjustmentsService;

  constructor(pool: PostgresJsDatabase) {
    this.adjustmentsService = new AdjustmentsService(pool);
  }

  async createAdjustments(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, remarks, adjustment_type, amount, description } = req.body;
      const employee_id = Number(req.params.employee_id);

      await this.adjustmentsService.createAdjustments({
        employee_id,
        name,
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
      const { adjustments_id, employee_id } = req.params;
      const { name, remarks, adjustment_type, amount, description } = req.body;

      await this.adjustmentsService.updateAdjustments(
        {
          name,
          remarks,
          adjustment_type,
          amount,
          description,
        },
        employee_id,
        adjustments_id,
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
      const { employee_id } = req.params;
      const result =
        await this.adjustmentsService.getAllAdjustments(employee_id);
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
      const { adjustments_id, employee_id } = req.params;
      const data = await this.adjustmentsService.getAdjustmentsById(
        adjustments_id,
        employee_id,
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
      const { adjustments_id, employee_id } = req.params;
      await this.adjustmentsService.deleteAdjustments(
        adjustments_id,
        employee_id,
      );
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

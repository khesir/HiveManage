import { Request, Response, NextFunction } from 'express';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';

import { HttpStatus } from '@/lib/config';
import { DeductionsService } from './deductions.service';

export class DeductionsController {
  private deductionsService: DeductionsService;

  constructor(pool: MySql2Database) {
    this.deductionsService = new DeductionsService(pool);
  }

  async getDeductions(req: Request, res: Response, next: NextFunction) {
    try {
      const { deduction_id } = req.params;
      const { employee_id } = req.query;
      const result = await this.deductionsService.getAllDeductions(
        Number(deduction_id),
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

  async getDeductionsById(req: Request, res: Response, next: NextFunction) {
    try {
      const { deduction_id } = req.params;
      const data = await this.deductionsService.getDeductionsById(
        Number(deduction_id),
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

  async createDeductions(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id, start, end, deduction_type, amount, description } =
        req.body;
      await this.deductionsService.createDeductions({
        employee_id,
        start,
        end,
        deduction_type,
        amount,
        description,
      });
      res
        .status(HttpStatus.CREATED.code)
        .json({ message: 'Deduction Successfully Created' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error ',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async updateDeductions(req: Request, res: Response, next: NextFunction) {
    try {
      const { deduction_id } = req.params;
      const { employee_id, start, end, deduction_type, amount, description } =
        req.body;
      await this.deductionsService.updateDeductions(
        { employee_id, start, end, deduction_type, amount, description },
        Number(deduction_id),
      );
      res
        .status(HttpStatus.OK.code)
        .json({ message: 'Deduction Updated Successfully' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteDeductionsById(req: Request, res: Response, next: NextFunction) {
    try {
      const { deduction_id } = req.params;
      await this.deductionsService.deleteDeductions(Number(deduction_id));
      res.status(200).json({
        message: `Deduction ID:${deduction_id} is deleted successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }
}

import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';

import { HttpStatus } from '@/lib/config';
import { DeductionsService } from './deductions.service';
import { SchemaType } from '@/drizzle/drizzle.schema';

export class DeductionsController {
  private deductionsService: DeductionsService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.deductionsService = new DeductionsService(pool);
  }

  async getDeductions(req: Request, res: Response, next: NextFunction) {
    try {
      const deductionsTypes = (req.query.benefits_type as string) || undefined;
      const employee_id = req.params.employee_id as string;
      const result = await this.deductionsService.getAllDeductions(
        deductionsTypes,
        employee_id,
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
      const { employee_id, deduction_id } = req.params;
      const data = await this.deductionsService.getDeductionsById(
        deduction_id,
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

  async createDeductions(req: Request, res: Response, next: NextFunction) {
    try {
      const employee_id = Number(req.params.employee_id);
      const {
        name,
        start,
        end,
        frequency,
        deduction_type,
        amount,
        description,
      } = req.body;
      await this.deductionsService.createDeductions({
        employee_id,
        name,
        start,
        end,
        deduction_type,
        frequency,
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
      const { deduction_id, employee_id } = req.params;
      const {
        name,
        start,
        end,
        frequency,
        deduction_type,
        amount,
        description,
      } = req.body;
      await this.deductionsService.updateDeductions(
        { name, start, end, deduction_type, frequency, amount, description },
        deduction_id,
        employee_id,
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
      const { deduction_id, employee_id } = req.params;
      await this.deductionsService.deleteDeductions(deduction_id, employee_id);
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

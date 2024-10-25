import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';

import { HttpStatus } from '@/lib/config';
import { AdditionalPayService } from './additionalPay.service';
import { SchemaType } from '@/drizzle/drizzle.schema';

export class AdditionalPayController {
  private additionalPayService: AdditionalPayService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.additionalPayService = new AdditionalPayService(pool);
  }

  async createAdditionalPay(req: Request, res: Response, next: NextFunction) {
    try {
      const employee_id = Number(req.params.employee_id);
      const { name, additional_pay_type, amount, description } = req.body;
      await this.additionalPayService.createAdditionalPay({
        employee_id,
        name,
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

  async getAdditionalPay(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id } = req.params;
      const result =
        await this.additionalPayService.getAllAdditionalPay(employee_id);
      res.status(HttpStatus.OK.code).json({ data: result });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getAdditionalPayById(req: Request, res: Response, next: NextFunction) {
    try {
      const { additional_pay_id, employee_id } = req.params;
      const data = await this.additionalPayService.getAdditionalPayById(
        employee_id,
        additional_pay_id,
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

  async updateAdditionalPay(req: Request, res: Response, next: NextFunction) {
    try {
      const { additional_pay_id, employee_id } = req.params;
      const { name, additional_pay_type, amount, description } = req.body;
      await this.additionalPayService.updateAdditionalPay(
        { name, additional_pay_type, amount, description },
        employee_id,
        additional_pay_id,
      );
      res
        .status(HttpStatus.OK.code)
        .json({ message: 'Additional Pay Updated Successfully ' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteAdditionalPayById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { additional_pay_id, employee_id } = req.params;
      await this.additionalPayService.deleteAdditionalPay(
        employee_id,
        additional_pay_id,
      );
      res.status(200).json({
        message: `Additional Pay ID:${additional_pay_id} is deleted successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }
}

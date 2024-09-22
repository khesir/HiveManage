import { Request, Response, NextFunction } from 'express';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';

import { HttpStatus } from '@/lib/config';
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

  async getAdditionalPay(req: Request, res: Response, next: NextFunction) {
    try {
      const { additional_pay_id } = req.params;
      const { employee_id } = req.query;
      const result = await this.additionalPayService.getAllAdditionalPay(
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

  async getAdditionalPayById(req: Request, res: Response, next: NextFunction) {
    try {
      const { additional_pay_id } = req.params;
      const data = await this.additionalPayService.getAdditionalPayById(
        Number(additional_pay_id),
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
      const { additional_pay_id } = req.params;
      const { employee_id, additional_pay_type, amount, description } =
        req.body;
      await this.additionalPayService.updateAdditionalPay(
        { employee_id, additional_pay_type, amount, description },
        Number(additional_pay_id),
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
      const { additional_pay_id } = req.params;
      await this.additionalPayService.deleteAdditionalPay(
        Number(additional_pay_id),
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

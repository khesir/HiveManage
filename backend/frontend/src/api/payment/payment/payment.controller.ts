import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PaymentService } from './payment.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { SchemaType } from '@/drizzle/schema/type';

export class PaymentController {
  private paymentService: PaymentService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.paymentService = new PaymentService(pool);
  }

  async getAllPayment(req: Request, res: Response, next: NextFunction) {
    const payment_status = (req.query.payment_status as string) || undefined;
    const payment_method = (req.query.payment_method as string) || undefined;
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.paymentService.getAllPayment(
        payment_method,
        payment_status,
        sort,
        limit,
        offset,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.totalData,
        limit: limit,
        offset: offset,
        data: data.paymentWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getPaymentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { payment_id } = req.params;
      const data = await this.paymentService.getPaymentById(Number(payment_id));
      res.status(200).json({ message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        service_id,
        sales_id,
        service_type,
        amount,
        vat_rate,
        discount_id,
        payment_date,
        payment_method,
        payment_status,
      } = req.body;

      await this.paymentService.createPayment({
        service_id,
        sales_id,
        service_type,
        amount,
        vat_rate,
        discount_id,
        payment_date,
        payment_method,
        payment_status,
      });
      res
        .status(HttpStatus.CREATED.code)
        .json({ status: 'Success', message: 'Successfully Created Payment ' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        status: 'Error ',
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async updatePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { payment_id } = req.params;
      const {
        service_id,
        sales_id,
        service_type,
        amount,
        vat,
        discount_id,
        payment_date,
        payment_method,
        payment_status,
      } = req.body;

      await this.paymentService.updatePayment(
        {
          service_id,
          sales_id,
          service_type,
          amount,
          vat,
          discount_id,
          payment_date,
          payment_method,
          payment_status,
        },
        Number(payment_id),
      );
      res
        .status(HttpStatus.OK.code)
        .json({ status: 'Success', message: 'Payment Updated Successfully ' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deletePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { payment_id } = req.params;
      await this.paymentService.deletePayment(Number(payment_id));
      res.status(200).json({
        status: 'Success',
        message: `Payment ID:${payment_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

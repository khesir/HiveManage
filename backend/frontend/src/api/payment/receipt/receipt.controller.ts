import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { ReceiptService } from './receipt.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/drizzle.schema';

export class ReceiptController {
  private receiptService: ReceiptService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.receiptService = new ReceiptService(pool);
  }

  async getAllReceipt(req: Request, res: Response, next: NextFunction) {
    const service_id = (req.params.service_id as string) || undefined;
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.receiptService.getAllReceipt(
        service_id,
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
        data: data.receiptWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getReceiptById(req: Request, res: Response, next: NextFunction) {
    try {
      const { receipt_id } = req.params;
      const data = await this.receiptService.getReceiptById(Number(receipt_id));
      res.status(200).json({ message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createReceipt(req: Request, res: Response, next: NextFunction) {
    try {
      const { service_id, payment_id, issued_date, total_amount } = req.body;

      await this.receiptService.createReceipt({
        service_id,
        payment_id,
        issued_date,
        total_amount,
      });
      res
        .status(HttpStatus.CREATED.code)
        .json({ status: 'Success', message: 'Successfully Created Receipt ' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        status: 'Error ',
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async updateReceipt(req: Request, res: Response, next: NextFunction) {
    try {
      const { receipt_id } = req.params;
      const { service_id, payment_id, issued_date, total_amount } = req.body;

      await this.receiptService.updateReceipt(
        { service_id, payment_id, issued_date, total_amount },
        Number(receipt_id),
      );
      res
        .status(HttpStatus.OK.code)
        .json({ status: 'Success', message: 'Receipt Updated Successfully ' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteReceipt(req: Request, res: Response, next: NextFunction) {
    try {
      const { receipt_id } = req.params;
      await this.receiptService.deleteReceipt(Number(receipt_id));
      res.status(200).json({
        status: 'Success',
        message: `Receipt ID:${receipt_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { ProductTransactionLogService } from './PTL.service';

export class ProductTransactionLogController {
  private producttransactionlogService: ProductTransactionLogService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.producttransactionlogService = new ProductTransactionLogService(pool);
  }

  async getAllOrderTransactionLog(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const product_id = (req.query.product_id as string) || undefined;
    const product_record_id =
      (req.query.product_record_id as string) || undefined;
    const serial_id = (req.query.serial_id as string) || '';
    const no_pagination = req.query.no_pagination == 'true';
    const sort = (req.query.sort as string) || 'asc';
    const limit = Number(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    try {
      const data =
        await this.producttransactionlogService.getAllProductTransactionLog(
          product_id,
          product_record_id,
          serial_id,
          no_pagination,
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
        data: data.producttranslogWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createProductTransactionLog(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const {
        product_id,
        product_record_id,
        serial_id,
        action,
        quantity,
        performed_by,
      } = req.body;

      await this.producttransactionlogService.createProductTransactionLog({
        product_id,
        product_record_id,
        serial_id,
        action,
        quantity,
        performed_by,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Product Transaction Log ',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        status: 'Error ',
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }
}

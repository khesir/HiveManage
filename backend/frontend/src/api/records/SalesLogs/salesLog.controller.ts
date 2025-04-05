import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { SalesLogService } from './salesLog.service';

export class SalesLogController {
  private saleslogService: SalesLogService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.saleslogService = new SalesLogService(pool);
  }

  async getSalesLog(req: Request, res: Response, next: NextFunction) {
    const sales_id = (req.params.sales_id as string) || undefined;
    const payment_id = (req.params.payment_id as string) || undefined;
    const sales_items_id = (req.params.sales_items_id as string) || undefined;
    const no_pagination = req.query.no_pagination == 'true';
    const sort = (req.query.sort as string) || 'asc';
    const limit = Number(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    try {
      const data = await this.saleslogService.getAllSalesLog(
        sales_id,
        payment_id,
        sales_items_id,
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
        data: data.saleslogWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createSalesLog(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        sales_id,
        payment_id,
        sales_items_id,
        action,
        quantity,
        performed_by,
      } = req.body;

      await this.saleslogService.createSalesLog({
        sales_id,
        payment_id,
        sales_items_id,
        action,
        quantity,
        performed_by,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Sales Log ',
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

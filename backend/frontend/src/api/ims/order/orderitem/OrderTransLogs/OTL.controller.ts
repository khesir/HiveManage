import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { OrderTransactionLogService } from './OTL.service';

export class OrderTransactionLogController {
  private ordertransactionlogService: OrderTransactionLogService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.ordertransactionlogService = new OrderTransactionLogService(pool);
  }

  async getAllOrderTransactionLog(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const order_id = (req.params.order_id as string) || undefined;
    const order_item_id = (req.params.order_item_id as string) || undefined;
    const no_pagination = req.query.no_pagination == 'true';
    const sort = (req.query.sort as string) || 'asc';
    const limit = Number(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    try {
      const data =
        await this.ordertransactionlogService.getAllOrderTransactionLog(
          order_id,
          order_item_id,
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
        data: data.ordertranslogWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createOrderTransactionLog(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const {
        order_id,
        order_item_id,
        product_id,
        total_quantity,
        ordered_quantity,
        delivered_quantity,
        resolved_quantity,
        status,
        action_type,
        performed_by,
        resolve_type,
      } = req.body;

      await this.ordertransactionlogService.createOrderTransactionLog({
        order_id,
        order_item_id,
        product_id,
        total_quantity,
        ordered_quantity,
        delivered_quantity,
        resolved_quantity,
        status,
        action_type,
        performed_by,
        resolve_type,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Order Transaction Log ',
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

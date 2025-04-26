import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { TranServiceItemService } from './transerviceitem.service';

export class TranServiceItemsController {
  private transerviceitemService: TranServiceItemService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.transerviceitemService = new TranServiceItemService(pool);
  }

  async getAllTranServiceItems(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const service_record_id = req.params.service_record_id as string;
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.transerviceitemService.getAllTranServiceItem(
        service_record_id,
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
        data: data.transactionserviceItemWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getTranServiceItemsById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { transaction_service_Record } = req.params;
      const data = await this.transerviceitemService.getTranServiceItemById(
        Number(transaction_service_Record),
      );
      res.status(200).json({ status: 'Success', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createTranServiceItems(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { service_record_id, service_id, quantity } = req.body;

      await this.transerviceitemService.createTranServiceItem({
        service_record_id,
        service_id,
        quantity,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Service Item ',
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

  async updateTranServiceItems(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { transaction_service_Record } = req.params;
      const { service_record_id, service_id, quantity } = req.body;

      await this.transerviceitemService.updateTranServiceItem(
        {
          service_record_id,
          service_id,
          quantity,
        },
        Number(transaction_service_Record),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Transaction Service Item Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteTranServiceItems(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { transaction_service_Record } = req.params;
      await this.transerviceitemService.deleteTranServiceItem(
        Number(transaction_service_Record),
      );
      res.status(200).json({
        status: 'Success',
        message: `Transaction Service Item ID:${transaction_service_Record} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

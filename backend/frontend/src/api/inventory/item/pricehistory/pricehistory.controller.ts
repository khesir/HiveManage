import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/drizzle.schema';
import { PriceHistoryService } from './pricehistory.service';

export class PriceHistoryController {
  private pricehistoryService: PriceHistoryService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.pricehistoryService = new PriceHistoryService(pool);
  }

  async getAllPriceHistory(req: Request, res: Response, next: NextFunction) {
    const item_id = req.params.item_id as string;
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.pricehistoryService.getAllPriceHistory(
        item_id,
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
        data: data.pricehistoryitemWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getPriceHistoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { price_history_id } = req.params;
      const data =
        await this.pricehistoryService.getPriceHistoryByID(price_history_id);
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createPriceHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { item_id, price, change_date } = req.body;

      await this.pricehistoryService.createPriceHistory({
        item_id,
        price,
        change_date,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Price History ',
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

  async updatePriceHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { price_history_id } = req.params;
      const { item_id, price, change_date } = req.body;

      await this.pricehistoryService.updatePriceHistory(
        {
          item_id,
          price,
          change_date,
        },
        Number(price_history_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Price History Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deletePriceHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { price_history_id } = req.params;
      await this.pricehistoryService.deletePriceHistory(
        Number(price_history_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Price History ID:${price_history_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

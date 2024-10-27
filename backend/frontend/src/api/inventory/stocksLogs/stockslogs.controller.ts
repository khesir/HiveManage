import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { StocksLogsService } from './stockslogs.service';
import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '@/lib/config';
import { SchemaType } from '@/drizzle/drizzle.schema';

export class StocksLogsController {
  private stockslogsService: StocksLogsService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.stockslogsService = new StocksLogsService(pool);
  }

  async getAllStocksLogs(req: Request, res: Response, next: NextFunction) {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const sort = (req.query.sort as string) || 'asc';

    try {
      const data = await this.stockslogsService.getAllStocksLogs(
        limit,
        offset,
        sort,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.totalData,
        limit: limit,
        offset: offset,
        data: data.itemsWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ messsage: 'Internal Server Error' });
      next(error);
    }
  }

  async getStockLogById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.stock_id;

    try {
      const data = await this.stockslogsService.getStockLogByID(id);
      res.status(HttpStatus.OK.code).json({ data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ messsage: 'Internal Server Error' });
      next(error);
    }
  }
}

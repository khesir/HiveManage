import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { ReserveItemService } from './reservevItem.service';

export class ReserveItemController {
  private reserveitemService: ReserveItemService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.reserveitemService = new ReserveItemService(pool);
  }

  async getAllReserveItem(req: Request, res: Response, next: NextFunction) {
    const status = (req.query.status as string) || undefined;
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.reserveitemService.getAllReserveItem(
        status,
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
        data: data.reserveitemWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getReserveItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const { reserve_item_id } = req.params;
      const data = await this.reserveitemService.getReserveItemById(
        Number(reserve_item_id),
      );
      res.status(200).json({ message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createReserveItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_id, reserve_id, status } = req.body;

      await this.reserveitemService.createReserveItem({
        product_id,
        reserve_id,
        status,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Reserve Item ',
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

  async updateReserveItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { reserve_item_id } = req.params;
      const { product_id, reserve_id, reserve_status } = req.body;

      await this.reserveitemService.updateReserveItem(
        { product_id, reserve_id, reserve_status },
        Number(reserve_item_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Reserve Item Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteReserveItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { reserve_item_id } = req.params;
      await this.reserveitemService.deleteReserveItem(Number(reserve_item_id));
      res.status(200).json({
        status: 'Success',
        message: `Reserve Item ID:${reserve_item_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

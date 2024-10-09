import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { ArriveItemsService } from './arriveItem.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class ArriveItemsController {
  private arriveitemService: ArriveItemsService;

  constructor(pool: PostgresJsDatabase) {
    this.arriveitemService = new ArriveItemsService(pool);
  }

  async getAllArriveItems(req: Request, res: Response, next: NextFunction) {
    const id = (req.query.id as string) || undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.arriveitemService.getAllArriveItems(
        id,
        limit,
        offset,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.length,
        limit: limit,
        offset: offset,
        data: data,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getArriveItemsById(req: Request, res: Response, next: NextFunction) {
    try {
      const { arrive_items_id } = req.params;
      const data = await this.arriveitemService.getArriveItemsById(
        Number(arrive_items_id),
      );
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createArriveItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { order_id, filePath } = req.body;

      await this.arriveitemService.createArriveItems({ order_id, filePath });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Arrive Items ',
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

  async updateArriveItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { arrive_items_id } = req.params;
      const { order_id, filePath } = req.body;

      await this.arriveitemService.updateArriveItems(
        { order_id, filePath },
        Number(arrive_items_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Arrive Items Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteArriveItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { arrive_items_id } = req.params;
      await this.arriveitemService.deleteArriveItems(Number(arrive_items_id));
      res.status(200).json({
        status: 'Success',
        message: `Arrive Items ID:${arrive_items_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

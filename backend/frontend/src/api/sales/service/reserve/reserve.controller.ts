import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { ReserveService } from './reserve.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class ReserveController {
  private reserveService: ReserveService;

  constructor(pool: PostgresJsDatabase) {
    this.reserveService = new ReserveService(pool);
  }

  async getAllReserve(req: Request, res: Response, next: NextFunction) {
    const reserve_status = (req.query.reserve_status as string) || undefined;
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.reserveService.getAllReserve(
        reserve_status,
        sort,
        limit,
        offset,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.reserveWithDetails,
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

  async getReserveById(req: Request, res: Response, next: NextFunction) {
    try {
      const { reserve_id } = req.params;
      const data = await this.reserveService.getReserveById(Number(reserve_id));
      res.status(200).json({ message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createReserve(req: Request, res: Response, next: NextFunction) {
    try {
      const { service_id, sales_item_id, reserve_status } = req.body;

      await this.reserveService.createReserve({
        service_id,
        sales_item_id,
        reserve_status,
      });
      res
        .status(HttpStatus.CREATED.code)
        .json({ status: 'Success', message: 'Successfully Created Reserve ' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        status: 'Error ',
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async updateReserve(req: Request, res: Response, next: NextFunction) {
    try {
      const { reserve_id } = req.params;
      const { sales_id, service_id, item_id, reserve_status } = req.body;

      await this.reserveService.updateReserve(
        { sales_id, service_id, item_id, reserve_status },
        Number(reserve_id),
      );
      res
        .status(HttpStatus.OK.code)
        .json({ status: 'Success', message: 'Reserve Updated Successfully ' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteReserve(req: Request, res: Response, next: NextFunction) {
    try {
      const { reserve_id } = req.params;
      await this.reserveService.deleteReserve(Number(reserve_id));
      res.status(200).json({
        status: 'Success',
        message: `Reserve ID:${reserve_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

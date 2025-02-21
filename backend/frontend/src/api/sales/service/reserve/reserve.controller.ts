import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { ReserveService } from './reserve.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';

export class ReserveController {
  private reserveService: ReserveService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.reserveService = new ReserveService(pool);
  }

  async getAllReserve(req: Request, res: Response, next: NextFunction) {
    const customer_id = (req.params.customer_id as string) || undefined;
    const reserve_status = (req.query.reserve_status as string) || undefined;
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.reserveService.getAllReserve(
        customer_id,
        reserve_status,
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
        data: data.reserveWithDetails,
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
      const { customer_id, reserve_status } = req.body;

      await this.reserveService.createReserve({
        customer_id,
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
      const { customer_id, reserve_status } = req.body;

      await this.reserveService.updateReserve(
        { customer_id, reserve_status },
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

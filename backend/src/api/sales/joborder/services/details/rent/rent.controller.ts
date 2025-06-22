import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Request, Response, NextFunction } from 'express';
import { RentService } from './rent.service';
import { SchemaType } from '@/drizzle/schema/type';
import { HttpStatus } from '@/lib/HttpStatus';

export class RentController {
  private rentService: RentService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.rentService = new RentService(pool);
  }
  async getAllRent(req: Request, res: Response, next: NextFunction) {
    const no_pagination = req.query.no_pagination === 'true';
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.rentService.getAllRent(
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
        data: data.rentDetailsWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }
  async getRentById(req: Request, res: Response, next: NextFunction) {
    const { rent_id } = req.params;
    try {
      const data = await this.rentService.getRentById(Number(rent_id));
      res.status(HttpStatus.OK.code).json({ status: 'Sucess', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }
  async createRent(req: Request, res: Response, next: NextFunction) {
    const {
      service_id,
      rented_items,
      start_date,
      end_date,
      deposit,
      returned,
    } = req.body;
    try {
      await this.rentService.createRent({
        service_id,
        rented_items,
        start_date,
        end_date,
        deposit,
        returned,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created rent Details ',
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

  async updateRent(req: Request, res: Response, next: NextFunction) {
    const { rent_id } = req.params;
    const {
      service_id,
      rented_items,
      start_date,
      end_date,
      deposit,
      returned,
    } = req.body;
    try {
      await this.rentService.updateRent(
        {
          service_id,
          rented_items,
          start_date,
          end_date,
          deposit,
          returned,
        },
        Number(rent_id),
      );
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created rent Details ',
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
  async deleterent(req: Request, res: Response, next: NextFunction) {
    const { rent_id } = req.params;
    try {
      await this.rentService.deleterent(Number(rent_id));
      res.status(200).json({
        status: 'Success',
        message: `Service ID:${rent_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Request, Response, NextFunction } from 'express';
import { CleaningService } from './cleaning.service';
import { SchemaType } from '@/drizzle/schema/type';
import { HttpStatus } from '@/lib/HttpStatus';

export class CleaningController {
  private cleaningService: CleaningService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.cleaningService = new CleaningService(pool);
  }
  async getAllCleaning(req: Request, res: Response, next: NextFunction) {
    const no_pagination = req.query.no_pagination === 'true';
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.cleaningService.getAllCleaning(
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
        data: data.cleaningDetailsWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }
  async getCleaningById(req: Request, res: Response, next: NextFunction) {
    const { cleaning_id } = req.params;
    try {
      const data = await this.cleaningService.getCleaningById(
        Number(cleaning_id),
      );
      res.status(HttpStatus.OK.code).json({ status: 'Sucess', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }
  async createCleaning(req: Request, res: Response, next: NextFunction) {
    const { cleaning_id, service_id, method, notes } = req.body;
    try {
      await this.cleaningService.createCleaning({
        cleaning_id,
        service_id,
        method,
        notes,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created cleaning Details ',
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

  async UpdateCleaning(req: Request, res: Response, next: NextFunction) {
    const { cleaning_id } = req.params;
    const { service_id, method, notes } = req.body;
    try {
      await this.cleaningService.updateCleaning(
        {
          service_id,
          method,
          notes,
        },
        Number(cleaning_id),
      );
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created cleaning Details ',
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
  async deleteCleaning(req: Request, res: Response, next: NextFunction) {
    const { cleaning_id } = req.params;
    try {
      await this.cleaningService.deleteCleaning(Number(cleaning_id));
      res.status(200).json({
        status: 'Success',
        message: `Service ID:${cleaning_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

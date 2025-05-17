import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Request, Response, NextFunction } from 'express';
import { ServiceReturnService } from './serviceReturn.service';
import { SchemaType } from '@/drizzle/schema/type';
import { HttpStatus } from '@/lib/HttpStatus';

export class ServiceReturnController {
  private serviceReturnService: ServiceReturnService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.serviceReturnService = new ServiceReturnService(pool);
  }
  async getAllServiceReturn(req: Request, res: Response, next: NextFunction) {
    const no_pagination = req.query.no_pagination === 'true';
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.serviceReturnService.getAllServiceReturn(
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
        data: data.serviceReturnWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }
  async getServiceReturnById(req: Request, res: Response, next: NextFunction) {
    const { service_return_id } = req.params;
    try {
      const data = await this.serviceReturnService.getServiceReturnById(
        Number(service_return_id),
      );
      res.status(HttpStatus.OK.code).json({ status: 'Sucess', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }
  async createServiceReturn(req: Request, res: Response, next: NextFunction) {
    const {
      return_id,
      original_service_id,
      new_service_id,
      reason,
      under_warranty,
      returned_at,
    } = req.body;
    try {
      await this.serviceReturnService.createServiceReturn({
        return_id,
        original_service_id,
        new_service_id,
        reason,
        under_warranty,
        returned_at,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created ServiceReturn Details ',
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

  async updateServiceReturn(req: Request, res: Response, next: NextFunction) {
    const { service_return_id } = req.params;
    const {
      return_id,
      original_service_id,
      new_service_id,
      reason,
      under_warranty,
      returned_at,
    } = req.body;
    try {
      await this.serviceReturnService.updateServiceReturn(
        {
          return_id,
          original_service_id,
          new_service_id,
          reason,
          under_warranty,
          returned_at,
        },
        Number(service_return_id),
      );
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created ServiceReturn Details ',
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
  async deleteServiceReturn(req: Request, res: Response, next: NextFunction) {
    const { service_id } = req.params;
    try {
      await this.serviceReturnService.deleteServiceReturn(Number(service_id));
      res.status(200).json({
        status: 'Success',
        message: `Service ID:${service_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

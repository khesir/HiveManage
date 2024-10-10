import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { ServicesService } from './serviceses.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class ServiceController {
  private serviceService: ServicesService;

  constructor(pool: PostgresJsDatabase) {
    this.serviceService = new ServicesService(pool);
  }

  async getAllService(req: Request, res: Response, next: NextFunction) {
    const id = (req.query.id as string) || undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.serviceService.getAllServices(id, limit, offset);
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

  async getServiceById(req: Request, res: Response, next: NextFunction) {
    try {
      const { service_id } = req.params;
      const data = await this.serviceService.getServicesById(
        Number(service_id),
      );
      res.status(200).json({ message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createService(req: Request, res: Response, next: NextFunction) {
    try {
      const { sales_id, service_title, service_type } = req.body;

      await this.serviceService.createServices({
        sales_id,
        service_title,
        service_type,
      });
      res
        .status(HttpStatus.CREATED.code)
        .json({ status: 'Success', message: 'Successfully Created Service ' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        status: 'Error ',
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async updateService(req: Request, res: Response, next: NextFunction) {
    try {
      const { service_id } = req.params;
      const { sales_id, service_title, service_type } = req.body;

      await this.serviceService.updateServices(
        { sales_id, service_title, service_type },
        Number(service_id),
      );
      res
        .status(HttpStatus.OK.code)
        .json({ status: 'Success', message: 'Service Updated Successfully ' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteService(req: Request, res: Response, next: NextFunction) {
    try {
      const { service_id } = req.params;
      await this.serviceService.deleteServices(Number(service_id));
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

import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { ServiceTypeService } from './servicetype.service';

export class ServiceTypesController {
  private servicetypeService: ServiceTypeService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.servicetypeService = new ServiceTypeService(pool);
  }

  async getAllServiceTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.servicetypeService.getAllServiceType();
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        data: data,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getServiceTypesById(req: Request, res: Response, next: NextFunction) {
    try {
      const { service_type_id } = req.params;
      const data = await this.servicetypeService.getServiceTypeById(
        Number(service_type_id),
      );
      res.status(200).json({ status: 'Success', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createServiceTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body;

      await this.servicetypeService.createServiceType({
        name,
        description,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Service Type ',
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

  async updateServiceTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const { service_type_id } = req.params;
      const { name, description } = req.body;

      await this.servicetypeService.updateServiceType(
        { name, description },
        Number(service_type_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Service Type Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteServiceTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const { service_type_id } = req.params;
      await this.servicetypeService.deleteServiceType(Number(service_type_id));
      res.status(200).json({
        status: 'Success',
        message: `Service Type ID:${service_type_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

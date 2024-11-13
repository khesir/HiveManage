import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ServicesService } from './serviceses.service';
import { SchemaType } from '@/drizzle/drizzle.schema';

export class ServiceController {
  private serviceService: ServicesService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.serviceService = new ServicesService(pool);
  }

  async getAllService(req: Request, res: Response, next: NextFunction) {
    const sort = (req.query.sort as string) || 'asc';
    const service_status = (req.query.service_status as string) || undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const customer_id = (req.query.customer_id as string) || undefined;
    const employee_id = (req.query.employee_id as string) || undefined;
    try {
      const data = await this.serviceService.getAllServices(
        sort,
        limit,
        offset,
        service_status,
        customer_id,
        employee_id,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.totalData,
        limit: limit,
        offset: offset,
        data: data.serviceWithDetails,
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
      const data = await this.serviceService.getServicesById(service_id);
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
      const {
        customer_id,
        employee_id,
        service_title,
        service_description,
        service_status,
        has_reservation,
        has_sales_item,
        has_borrow,
        has_job_order,
      } = req.body;

      await this.serviceService.createServices({
        employee_id,
        customer_id,
        service_title,
        service_description,
        service_status,
        has_reservation,
        has_sales_item,
        has_borrow,
        has_job_order,
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
      const {
        customer_id,
        employee_id,
        service_title,
        service_type,
        has_reservation,
        has_sales_item,
        has_borrow,
        has_job_order,
      } = req.body;

      await this.serviceService.updateServices(
        {
          customer_id,
          employee_id,
          service_title,
          service_type,
          has_reservation,
          has_sales_item,
          has_borrow,
          has_job_order,
        },
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

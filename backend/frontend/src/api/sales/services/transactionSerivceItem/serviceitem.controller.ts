import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { ServiceItemService } from './serviceitem.service';

export class ServiceItemsController {
  private serviceitemService: ServiceItemService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.serviceitemService = new ServiceItemService(pool);
  }

  async getAllServiceItems(req: Request, res: Response, next: NextFunction) {
    const product_id = req.params.product_id as string;
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.serviceitemService.getAllServiceItem(
        product_id,
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
        data: data.serviceitemWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getServiceItemsById(req: Request, res: Response, next: NextFunction) {
    try {
      const { service_items_id } = req.params;
      const data = await this.serviceitemService.getServiceItemById(
        Number(service_items_id),
      );
      res.status(200).json({ status: 'Success', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createServiceItems(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        product_id,
        service_id,
        product_record_id,
        serial_id,
        serviceitem_status,
        quantity,
      } = req.body;

      await this.serviceitemService.createServiceItem({
        product_id,
        service_id,
        product_record_id,
        serial_id,
        serviceitem_status,
        quantity,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Service Item ',
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

  async updateServiceItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { service_items_id } = req.params;
      const {
        product_id,
        service_id,
        product_record_id,
        serial_id,
        serviceitem_status,
        quantity,
      } = req.body;

      await this.serviceitemService.updateServiceItem(
        {
          product_id,
          service_id,
          product_record_id,
          serial_id,
          serviceitem_status,
          quantity,
        },
        Number(service_items_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Service Item Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteServiceItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { service_items_id } = req.params;
      await this.serviceitemService.deleteServiceItem(Number(service_items_id));
      res.status(200).json({
        status: 'Success',
        message: `Service Item ID:${service_items_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

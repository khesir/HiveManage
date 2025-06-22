import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { HttpStatus } from '@/lib/HttpStatus';
import { SchemaType } from '@/drizzle/schema/type';
import { ServiceItemService } from './serviceItem.service';

export class ServiceItemController {
  private serviceItemservice: ServiceItemService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.serviceItemservice = new ServiceItemService(pool);
  }

  async getAllServiceItem(req: Request, res: Response, next: NextFunction) {
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const no_pagination = req.query.no_pagination === 'true';
    const service_id = req.params.service_id;
    try {
      const data = await this.serviceItemservice.getAllServiceItem(
        no_pagination,
        sort,
        limit,
        offset,
        Number(service_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.totalData,
        limit: limit,
        offset: offset,
        data: data.serviceitemsWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getServiceItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const { service_item_id } = req.params;
      const data = await this.serviceItemservice.getServiceItemById(
        Number(service_item_id),
      );
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createServiceItem(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        service_id,
        product_id,
        serialize_items,
        quantity,
        sold_price,
        status,
        product,
        user_id,
      } = req.body;

      await this.serviceItemservice.createServiceItem({
        service_id,
        product_id,
        serialize_items,
        quantity,
        sold_price,
        status,
        product,
        user_id,
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

  async updateServiceItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { service_item_id } = req.params;
      const {
        service_id,
        product_id,
        serialize_items,
        quantity,
        sold_price,
        status,
        product,
        user_id,
      } = req.body;

      await this.serviceItemservice.updateServiceItem(
        {
          service_id,
          product_id,
          serialize_items,
          quantity,
          sold_price,
          status,
          product,
          user_id,
        },
        Number(service_item_id),
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

  async deleteServiceItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { service_item_id } = req.params;
      await this.serviceItemservice.deleteServiceItem(Number(service_item_id));
      res.status(200).json({
        status: 'Success',
        message: `Service Item ID:${service_item_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

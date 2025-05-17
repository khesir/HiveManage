import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { OwnedServiceItemService } from './ownedItems.service';

export class OwnedServiceItemsController {
  private ownedServiceItemService: OwnedServiceItemService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.ownedServiceItemService = new OwnedServiceItemService(pool);
  }

  async getAllOwnedServiceItems(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.ownedServiceItemService.getAllOwnedServiceItems(
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
        data: data.serviceOwnedItemsWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getOwnedServiceItemsById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { service_owned_id } = req.params;
      const data = await this.ownedServiceItemService.getOwnedServiceItemsById(
        Number(service_owned_id),
      );
      res.status(200).json({ status: 'Success', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createOwnedServiceItems(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const {
        service_id,
        item_description,
        serial_number,
        brand,
        model,
        notes,
      } = req.body;

      await this.ownedServiceItemService.createOwnedServiceItems({
        service_id,
        item_description,
        serial_number,
        brand,
        model,
        notes,
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

  async updateOwnedServiceItems(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { service_owned_id } = req.params;
      const {
        service_id,
        item_description,
        serial_number,
        brand,
        model,
        notes,
      } = req.body;

      await this.ownedServiceItemService.updateOwnedServiceItems(
        {
          service_id,
          item_description,
          serial_number,
          brand,
          model,
          notes,
        },
        Number(service_owned_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Transaction Service Item Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteOwnedServiceItems(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { service_owned_id } = req.params;
      await this.ownedServiceItemService.deleteOwnedServiceItems(
        Number(service_owned_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Transaction Service Item ID:${service_owned_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

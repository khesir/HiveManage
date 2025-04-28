import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { HttpStatus } from '@/lib/HttpStatus';
import { SchemaType } from '@/drizzle/schema/type';
import { SerializeServiceItemService } from './serializedServItem.service';

export class SerializeServItemController {
  private serializedservItem: SerializeServiceItemService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.serializedservItem = new SerializeServiceItemService(pool);
  }

  async getAllSerializeServItem(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const no_pagination = req.query.no_pagination === 'true';
    const serial_id = req.params.serial_id as string;

    try {
      const data = await this.serializedservItem.getAllSerializeServiceItem(
        serial_id,
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
        data: data.serializedserviceproductsWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getSerializeServItemById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { service_serilize_record_id } = req.params;
      const data = await this.serializedservItem.getSerializeServiceItemById(
        Number(service_serilize_record_id),
      );
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createSerializeServItem(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { serial_id, service_item_id, quantity, status } = req.body;

      await this.serializedservItem.createSerializeServiceItem({
        serial_id,
        service_item_id,
        quantity,
        status,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Serialize Product ',
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

  async updateSerializeServItem(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { service_serilize_record_id } = req.params;
      const { serial_id, service_item_id, quantity, status } = req.body;

      await this.serializedservItem.updateSerializeServiceItem(
        {
          serial_id,
          service_item_id,
          quantity,
          status,
        },
        Number(service_serilize_record_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Serialize Service Item Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteSerializeServItem(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { service_serilize_record_id } = req.params;
      await this.serializedservItem.deleteSerializeServiceItem(
        Number(service_serilize_record_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Serialize Service Item ID:${service_serilize_record_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

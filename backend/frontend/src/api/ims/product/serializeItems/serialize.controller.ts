import { Request, Response, NextFunction } from 'express';
import { SchemaType } from '@/drizzle/drizzle.config';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { HttpStatus } from '@/lib/HttpStatus';
import { SerializeItemService } from './serialize.service';

export class SerializeItemController {
  private itemService: SerializeItemService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.itemService = new SerializeItemService(pool);
  }

  async getAllSerializeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const item_id = parseInt(req.params.item_id);
      const data = await this.itemService.getAllSerializeItem(item_id);
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

  async getSerializeItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const { batch_id } = req.params;
      const data = await this.itemService.getSerializeItemByID(batch_id);
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createSerializeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        item_id,
        serial_number,
        item_condition,
        item_status,
        unit_price,
        selling_price,
        warranty_expiry_date,
      } = req.body;

      await this.itemService.createSerializeItem({
        item_id,
        serial_number,
        item_condition,
        item_status,
        unit_price,
        selling_price,
        warranty_expiry_date,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created SerializeItem ',
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

  async updateSerializeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { batch_id } = req.params;
      const {
        item_id,
        serial_number,
        item_condition,
        item_status,
        unit_price,
        selling_price,
        production_date,
        expiration_date,
      } = req.body;

      await this.itemService.updateSerializeItem(
        {
          item_id,
          serial_number,
          item_condition,
          item_status,

          unit_price,
          selling_price,
          production_date,
          expiration_date,
        },
        Number(batch_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'SerializeItem Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteSerializeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { item_id } = req.params;
      await this.itemService.deleteSerializeItem(Number(item_id));
      res.status(200).json({
        status: 'Success',
        message: `SerializeItem ID:${item_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

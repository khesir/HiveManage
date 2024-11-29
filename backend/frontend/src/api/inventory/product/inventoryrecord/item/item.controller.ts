import { Request, Response, NextFunction } from 'express';
import { SchemaType } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { HttpStatus } from '@/lib/HttpStatus';
import { ItemService } from './item.service';

export class ItemController {
  private itemService: ItemService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.itemService = new ItemService(pool);
  }

  async getAllItem(req: Request, res: Response, next: NextFunction) {
    const item_record_id = req.params.item_record_id as string;
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.itemService.getAllItem(
        item_record_id,
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
        data: data.itemWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const { item_id } = req.params;
      const data = await this.itemService.getItemByID(item_id);
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createItem(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        item_record_id,
        variant_id,
        item_type,
        item_condition,
        item_status,
        quantity,
      } = req.body;

      await this.itemService.createItem({
        item_record_id,
        variant_id,
        item_type,
        item_condition,
        item_status,
        quantity,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Item ',
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

  async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { item_id } = req.params;
      const {
        item_record_id,
        variant_id,
        item_type,
        item_condition,
        item_status,
        quantity,
      } = req.body;

      await this.itemService.updateItem(
        {
          item_record_id,
          variant_id,
          item_type,
          item_condition,
          item_status,
          quantity,
        },
        Number(item_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Item Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { item_id } = req.params;
      await this.itemService.deleteItem(Number(item_id));
      res.status(200).json({
        status: 'Success',
        message: `Item ID:${item_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

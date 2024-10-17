import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { ItemService } from './item.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class ItemsController {
  private itemService: ItemService;

  constructor(pool: PostgresJsDatabase) {
    this.itemService = new ItemService(pool);
  }

  async getAllItem(req: Request, res: Response, next: NextFunction) {
    const id = (req.query.id as string) || undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.itemService.getAllItem(id, limit, offset);
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.totalData,
        limit: limit,
        offset: offset,
        data: data.itemsWithDetails,
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
      const data = await this.itemService.getItemById(item_id);
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
      const { product_id, stock, re_order_level, tag } = req.body;

      await this.itemService.createItem({
        product_id,
        stock,
        re_order_level,
        tag,
      });

      res
        .status(HttpStatus.CREATED.code)
        .json({ status: 'Success', message: 'Successfully Created Item ' });
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
      const { product_id, stock, re_order_level, tag } = req.body;

      await this.itemService.updateItem(
        { product_id, stock, re_order_level, tag },
        Number(item_id),
      );
      res
        .status(HttpStatus.OK.code)
        .json({ status: 'Success', message: 'Item Updated Successfully ' });
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

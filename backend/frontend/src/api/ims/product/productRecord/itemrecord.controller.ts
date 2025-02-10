import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/drizzle.config';
import { ItemRecordService } from './itemrecord.service';

export class ItemRecordController {
  private itemrecordService: ItemRecordService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.itemrecordService = new ItemRecordService(pool);
  }

  async getAllItemRecord(req: Request, res: Response, next: NextFunction) {
    const product_id = req.params.product_id as string;
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.itemrecordService.getAllItemRecord(
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
        data: data.itemrecordWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getItemRecordById(req: Request, res: Response, next: NextFunction) {
    try {
      const { item_record_id } = req.params;
      const data =
        await this.itemrecordService.getItemRecordByID(item_record_id);
      res.status(200).json({ status: 'Success', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createItemRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const product_id = req.params.product_id;
      const { supplier_id, total_stock, item } = req.body;
      await this.itemrecordService.createItemRecord(
        {
          supplier_id,
          total_stock,
          item,
        },
        product_id,
      );

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Item Record ',
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

  async updateItemRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const { item_record_id } = req.params;
      const { supplier_id, product_id, total_stock } = req.body;

      await this.itemrecordService.updateItemRecord(
        {
          supplier_id,
          product_id,
          total_stock,
        },
        Number(item_record_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Item Record Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteItemRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const { item_record_id } = req.params;
      await this.itemrecordService.deleteItemRecord(Number(item_record_id));
      res.status(200).json({
        status: 'Success',
        message: `Item Record ID:${item_record_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { ProductRecordService } from './productRecord.service';

export class ProductRecordController {
  private productrecordService: ProductRecordService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.productrecordService = new ProductRecordService(pool);
  }

  async getAllProductRecord(req: Request, res: Response, next: NextFunction) {
    const product_id = req.params.product_id as string;
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    console.log(product_id);
    try {
      const data = await this.productrecordService.getAllItemRecord(
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

  async getProductRecordById(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_record_id } = req.params;
      const data =
        await this.productrecordService.getItemRecordByID(product_record_id);
      res.status(200).json({ status: 'Success', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createProductRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        product_id,
        supplier_id,
        order_item_id,
        quantity,
        status,
        handled_by,
      } = req.body;
      await this.productrecordService.createProductRecord({
        product_id,
        supplier_id,
        order_item_id,
        quantity,
        status,
        handled_by,
      });

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

  async updateProductRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_record_id } = req.params;
      const {
        product_id,
        supplier_id,
        order_item_id,
        quantity,
        status,
        handled_by,
      } = req.body;

      await this.productrecordService.updateItemRecord(
        {
          product_id,
          supplier_id,
          order_item_id,
          quantity,
          status,
          handled_by,
        },
        Number(product_record_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Product Record Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteProductRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_record_id } = req.params;
      await this.productrecordService.deleteItemRecord(
        Number(product_record_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Product Record ID:${product_record_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

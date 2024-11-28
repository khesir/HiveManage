import { Request, Response, NextFunction } from 'express';
import { SchemaType } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { HttpStatus } from '@/lib/HttpStatus';
import { BatchService } from './batch.service';

export class BatchController {
  private itemService: BatchService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.itemService = new BatchService(pool);
  }

  async getAllBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const item_id = parseInt(req.params.item_id);
      const data = await this.itemService.getAllBatch(item_id);
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

  async getBatchById(req: Request, res: Response, next: NextFunction) {
    try {
      const { batch_id } = req.params;
      const data = await this.itemService.getBatchByID(batch_id);
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        item_id,
        batch_number,
        item_condition,
        item_status,
        quantity,
        reserved_quantity,
        unit_price,
        selling_price,
        production_date,
        expiration_date,
      } = req.body;

      await this.itemService.createBatch({
        item_id,
        batch_number,
        item_condition,
        item_status,
        quantity,
        reserved_quantity,
        unit_price,
        selling_price,
        production_date,
        expiration_date,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Batch ',
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

  async updateBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const { batch_id } = req.params;
      const {
        item_id,
        batch_number,
        item_condition,
        item_status,
        quantity,
        reserved_quantity,
        unit_price,
        selling_price,
        production_date,
        expiration_date,
      } = req.body;

      await this.itemService.updateBatch(
        {
          item_id,
          batch_number,
          item_condition,
          item_status,
          quantity,
          reserved_quantity,
          unit_price,
          selling_price,
          production_date,
          expiration_date,
        },
        Number(batch_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Batch Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const { item_id } = req.params;
      await this.itemService.deleteBatch(Number(item_id));
      res.status(200).json({
        status: 'Success',
        message: `Batch ID:${item_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/drizzle.schema';
import { InventoryRecordService } from './inventoryrecord.service';

export class InventoryRecordController {
  private inventoryrecordService: InventoryRecordService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.inventoryrecordService = new InventoryRecordService(pool);
  }

  async getAllInventoryRecord(req: Request, res: Response, next: NextFunction) {
    const product_id = req.params.product_id as string;
    const tag = (req.query.tag as string) || undefined;
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.inventoryrecordService.getAllInventoryRecord(
        product_id,
        tag,
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
        data: data.inventoryrecordWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getInventoryRecordById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { inventory_record_id } = req.params;
      const data =
        await this.inventoryrecordService.getInventoryRecordByID(
          inventory_record_id,
        );
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createInventoryRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const { supplier_id, item_id, tag, stock } = req.body;

      await this.inventoryrecordService.createInventoryRecord({
        supplier_id,
        item_id,
        tag,
        stock,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Inventory Record ',
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

  async updateInventoryRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const { inventory_record_id } = req.params;
      const { supplier_id, item_id, tag, stock } = req.body;

      await this.inventoryrecordService.updateInventoryRecord(
        {
          supplier_id,
          item_id,
          tag,
          stock,
        },
        Number(inventory_record_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Inventory Record Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteInventoryRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const { inventory_record_id } = req.params;
      await this.inventoryrecordService.deleteInventoryRecord(
        Number(inventory_record_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Inventory Record ID:${inventory_record_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

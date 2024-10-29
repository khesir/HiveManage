import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/drizzle.schema';
import { SupplierItemService } from './supplieritem.service';

export class SupplierItemController {
  private supplieritemService: SupplierItemService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.supplieritemService = new SupplierItemService(pool);
  }

  async getAllSupplierItem(req: Request, res: Response, next: NextFunction) {
    const item_id = req.params.item_id as string;
    const tag = (req.query.tag as string) || undefined;
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.supplieritemService.getAllSupplierItem(
        item_id,
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
        data: data.supplieritemWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getSupplierItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const { item_supplier_id } = req.params;
      const data =
        await this.supplieritemService.getSupplierItemByID(item_supplier_id);
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createSupplierItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { supplier_id, item_id, tag, stock } = req.body;

      await this.supplieritemService.createSupplierItem({
        supplier_id,
        item_id,
        tag,
        stock,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Supplier Item ',
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

  async updateSupplierItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { item_supplier_id } = req.params;
      const { supplier_id, item_id, tag, stock } = req.body;

      await this.supplieritemService.updateSupplierItem(
        {
          supplier_id,
          item_id,
          tag,
          stock,
        },
        Number(item_supplier_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Supplier Item Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteSupplierItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { item_supplier_id } = req.params;
      await this.supplieritemService.deleteSupplierItem(
        Number(item_supplier_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Supplier Item ID:${item_supplier_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

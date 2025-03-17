import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ProductSupplierService } from './productSupplier.service';
import { SchemaType } from '@/drizzle/schema/type';
import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '@/lib/HttpStatus';

export class ProductSupplierController {
  private productSupplierService: ProductSupplierService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.productSupplierService = new ProductSupplierService(pool);
  }

  async getAllProductSupplier(req: Request, res: Response, next: NextFunction) {
    const product_id = req.params.product_id as string;
    const no_pagination = req.query.no_pagination == 'true';
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.productSupplierService.getAllProductSupplier(
        product_id,
        sort,
        limit,
        offset,
        no_pagination,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Sucess',
        message: 'Data Retrieved Successfully',
        total_data: data.totalData,
        limit: limit,
        offset: offset,
        data: data.productSupplierWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error' });
      next(error);
    }
  }

  // async getProductSupplierById(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ) {}

  async createProductSupplier(req: Request, res: Response, next: NextFunction) {
    const { supplier_id, product_id } = req.body;

    try {
      await this.productSupplierService.createProductSupplier({
        supplier_id,
        product_id,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Product Supplier ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  // async updateProductSupplier(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ) {}

  async deleteProductSupplier(req: Request, res: Response, next: NextFunction) {
    const { product_supplier_id } = req.params;
    try {
      await this.productSupplierService.deleteProductSupplier(
        Number(product_supplier_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Product Supplier ID:${product_supplier_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

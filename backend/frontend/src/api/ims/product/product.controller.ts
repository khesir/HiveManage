import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { SchemaType } from '@/drizzle/schema/type';

export class ProductController {
  private productService: ProductService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.productService = new ProductService(pool);
  }

  async getAllProduct(req: Request, res: Response, next: NextFunction) {
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const supplier_id = req.query.supplier_id
      ? String(req.query.supplier_id)
      : undefined;

    try {
      const data = await this.productService.getAllProduct(
        supplier_id,
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
        data: data.productWithDetails,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_id } = req.params;
      const data = await this.productService.getProductById(Number(product_id));
      res.status(200).json({ data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        supplier_id,
        product_details_id,
        price,
        discount,
        is_serialize,
        itemStatus,
      } = req.body;

      await this.productService.createProduct({
        supplier_id,
        product_details_id,
        price,
        discount,
        is_serialize,
        itemStatus,
      });

      res
        .status(HttpStatus.CREATED.code)
        .json({ status: 'Success', message: 'Successfully Created Product' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        status: 'Error',
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_id } = req.params;
      const {
        supplier_id,
        product_details_id,
        price,
        discount,
        is_serialized,
        itemStatus,
      } = req.body;

      await this.productService.updateProduct(
        {
          supplier_id,
          product_details_id,
          price,
          discount,
          is_serialized,
          itemStatus,
        },
        Number(product_id),
      );
      res
        .status(HttpStatus.OK.code)
        .json({ status: 'Success', message: 'Product Updated Successfully ' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_id } = req.params;
      await this.productService.deleteProduct(Number(product_id));
      res.status(200).json({
        status: 'Success',
        message: `Product ID:${product_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

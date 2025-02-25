import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { ProductDetailsService } from './p_det.service';

export class ProductDetailsController {
  private productdetailsService: ProductDetailsService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.productdetailsService = new ProductDetailsService(pool);
  }

  async getAllProductDetails(req: Request, res: Response, next: NextFunction) {
    const category_id = req.params.category_id as string;
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.productdetailsService.getAllProductDetails(
        category_id,
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
        data: data.productdetailsWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getProductDetailsById(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_details_id } = req.params;
      const data =
        await this.productdetailsService.getProductDetailsByID(
          product_details_id,
        );
      res.status(200).json({ status: 'Success', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createProductDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        category_id,
        name,
        description,
        product_type,
        product_status,
        img_url,
        external_serial_code,
        warranty_date,
      } = req.body;
      await this.productdetailsService.createProductDetails({
        category_id,
        name,
        description,
        product_type,
        product_status,
        img_url,
        external_serial_code,
        warranty_date,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Product Details ',
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

  async updateProductDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_details_id } = req.params;
      const {
        category_id,
        name,
        description,
        product_type,
        product_status,
        img_url,
        external_serial_code,
        warranty_date,
      } = req.body;

      await this.productdetailsService.updateProductDetails(
        {
          category_id,
          name,
          description,
          product_type,
          product_status,
          img_url,
          external_serial_code,
          warranty_date,
        },
        Number(product_details_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Product Details Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteProductDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_details_id } = req.params;
      await this.productdetailsService.deleteProductDetails(
        Number(product_details_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Product Details ID:${product_details_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { SchemaType } from '@/drizzle/drizzle.schema';
import { ProductVariantService } from './prodvar.service';

export class ProductVariantController {
  private productvariantService: ProductVariantService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.productvariantService = new ProductVariantService(pool);
  }

  async getAllProductVariant(req: Request, res: Response, next: NextFunction) {
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const product_id = parseInt(req.params.product_id) || undefined;
    const no_pagination = req.query.no_pagination === 'true';
    try {
      const data = await this.productvariantService.getAllProductVariant(
        sort,
        limit,
        offset,
        product_id,
        no_pagination,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.totalData,
        limit: limit,
        offset: offset,
        data: data.productvariantWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getProductVariantById(req: Request, res: Response, next: NextFunction) {
    try {
      const { variant_id } = req.params;
      const data = await this.productvariantService.getProductVariantById(
        Number(variant_id),
      );
      res.status(200).json({ data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createProductVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_id, img_url, variant_name, attribute } = req.body;

      await this.productvariantService.createProductVariant({
        // Ensure correct method name
        product_id,
        img_url,
        variant_name,
        attribute,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Product Variant',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        status: 'Error',
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async updateProductVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const { variant_id } = req.params;
      const { product_id, img_url, variant_name, attribute } = req.body;

      await this.productvariantService.updateProductVariant(
        { product_id, img_url, variant_name, attribute },
        Number(variant_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Product Variant Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteProductVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const { variant_id } = req.params;
      await this.productvariantService.deleteProductVariant(Number(variant_id));
      res.status(200).json({
        status: 'Success',
        message: `Product Variant ID:${variant_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

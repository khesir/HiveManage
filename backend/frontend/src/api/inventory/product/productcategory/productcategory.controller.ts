import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { SchemaType } from '@/drizzle/drizzle.schema';
import { ProductCategoryService } from './productcategory.service';

export class ProductCategoryController {
  private productcategoryService: ProductCategoryService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.productcategoryService = new ProductCategoryService(pool);
  }

  async getAllProductCategory(req: Request, res: Response, next: NextFunction) {
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.productcategoryService.getAllProductCategory(
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
        data: data.productcategoryWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getProductCategoryById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { product_category_id } = req.params;
      const data = await this.productcategoryService.getProductCategoryById(
        Number(product_category_id),
      );
      res.status(200).json({ data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createProductCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_id, category_id } = req.body;

      await this.productcategoryService.createProductCategory({
        // Ensure correct method name
        product_id,
        category_id,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Product Category',
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

  async updateProductCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_category_id } = req.params;
      const { product_id, category_id } = req.body;

      await this.productcategoryService.updateProductCategory(
        { product_id, category_id },
        Number(product_category_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Product Category Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteProductCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_category_id } = req.params;
      await this.productcategoryService.deleteProductCategory(
        Number(product_category_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Product Category ID:${product_category_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

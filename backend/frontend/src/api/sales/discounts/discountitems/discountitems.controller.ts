import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { DiscountItemService } from './discountitems.service';

export class DiscountItemController {
  private discountitemService: DiscountItemService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.discountitemService = new DiscountItemService(pool);
  }

  async getAllDiscountItem(req: Request, res: Response, next: NextFunction) {
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.discountitemService.getAllDiscountItem(
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
        data: data.discountitemWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getDiscountItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const { discount_product_id } = req.params;
      const data = await this.discountitemService.getDiscountItemById(
        Number(discount_product_id),
      );
      res.status(200).json({ message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createDiscountItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_id, discount_id, category_id } = req.body;

      await this.discountitemService.createDiscountItem({
        product_id,
        discount_id,
        category_id,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Discount Item ',
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

  async updateDiscountItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { discount_product_id } = req.params;
      const { product_id, discount_id, category_id } = req.body;

      await this.discountitemService.updateDiscountItem(
        { product_id, discount_id, category_id },
        Number(discount_product_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Discount Item Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteDiscountItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { discount_product_id } = req.params;
      await this.discountitemService.deleteDiscountItem(
        Number(discount_product_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Discount Item ID:${discount_product_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

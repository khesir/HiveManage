import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { DiscountService } from './discount.service';

export class DiscountController {
  private discountService: DiscountService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.discountService = new DiscountService(pool);
  }

  async getAllDiscount(req: Request, res: Response, next: NextFunction) {
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.discountService.getAllDiscount(
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
        data: data.result,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getDiscountById(req: Request, res: Response, next: NextFunction) {
    try {
      const { discount_id } = req.params;
      const data = await this.discountService.getDiscountById(
        Number(discount_id),
      );
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        discount_name,
        discount_type,
        discount_value,
        coupon_code,
        is_single_use,
        max_redemption,
        start_date,
        end_date,
        is_active,
        min_purchase_amount,
        max_purchase_amount,
        usage_limit,
        times_used,
      } = req.body;

      await this.discountService.createDiscount({
        discount_name,
        discount_type,
        discount_value,
        coupon_code,
        is_single_use,
        max_redemption,
        start_date,
        end_date,
        is_active,
        min_purchase_amount,
        max_purchase_amount,
        usage_limit,
        times_used,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Discount ',
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

  async updateDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const { discount_id } = req.params;
      const {
        discount_name,
        discount_type,
        discount_value,
        coupon_code,
        is_single_use,
        max_redemption,
        start_date,
        end_date,
        is_active,
        min_purchase_amount,
        max_purchase_amount,
        usage_limit,
        times_used,
      } = req.body;

      await this.discountService.updateDiscount(
        {
          discount_name,
          discount_type,
          discount_value,
          coupon_code,
          is_single_use,
          max_redemption,
          start_date,
          end_date,
          is_active,
          min_purchase_amount,
          max_purchase_amount,
          usage_limit,
          times_used,
        },
        Number(discount_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Discount Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const { discount_id } = req.params;
      await this.discountService.deleteDiscount(Number(discount_id));
      res.status(200).json({
        status: 'Success',
        message: `Discount ID:${discount_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

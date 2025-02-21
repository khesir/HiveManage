import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { CouponRedemptionService } from './couponRedemption.service';

export class CouponRedemptionController {
  private couponredemptionService: CouponRedemptionService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.couponredemptionService = new CouponRedemptionService(pool);
  }

  async getAllCouponRedemption(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.couponredemptionService.getAllCouponRedemption(
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
        data: data.couponredemptionWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getCouponRedemptionById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { couponredemptions_id } = req.params;
      const data = await this.couponredemptionService.getCouponRedemptionById(
        Number(couponredemptions_id),
      );
      res.status(200).json({ message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createCouponRedemption(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { customer_id, discount_id } = req.body;

      await this.couponredemptionService.createCouponRedemption({
        customer_id,
        discount_id,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Coupon Redemption ',
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

  async updateCouponRedemption(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { couponredemptions_id } = req.params;
      const { customer_id, discount_id } = req.body;

      await this.couponredemptionService.updateCouponRedemption(
        { customer_id, discount_id },
        Number(couponredemptions_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Coupon Redemption Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteCouponRedemption(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { couponredemptions_id } = req.params;
      await this.couponredemptionService.deleteCouponRedemption(
        Number(couponredemptions_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Coupon Redemption ID:${couponredemptions_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

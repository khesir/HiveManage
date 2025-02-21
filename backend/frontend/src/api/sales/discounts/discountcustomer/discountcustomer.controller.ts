import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { DiscountCustomerService } from './discountcustomer.service';

export class DiscountCustomerController {
  private discountcustomerService: DiscountCustomerService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.discountcustomerService = new DiscountCustomerService(pool);
  }

  async getAllDiscountCustomer(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.discountcustomerService.getAllDiscountCustomer(
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
        data: data.discountcustomerWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getDiscountCustomerById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { discount_customer_id } = req.params;
      const data = await this.discountcustomerService.getDiscountCustomerById(
        Number(discount_customer_id),
      );
      res.status(200).json({ message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createDiscountCustomer(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { customer_id, customer_group_id, discount_id } = req.body;

      await this.discountcustomerService.createDiscountCustomer({
        customer_id,
        customer_group_id,
        discount_id,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Discount Customer ',
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

  async updateDiscountCustomer(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { discount_customer_id } = req.params;
      const { customer_id, customer_group_id, discount_id } = req.body;

      await this.discountcustomerService.updateDiscountCustomer(
        { customer_id, customer_group_id, discount_id },
        Number(discount_customer_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Discount Customer Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteDiscountCustomer(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { discount_customer_id } = req.params;
      await this.discountcustomerService.deleteDiscountCustomer(
        Number(discount_customer_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Discount Customer ID:${discount_customer_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

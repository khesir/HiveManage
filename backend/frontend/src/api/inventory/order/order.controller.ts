import { Request, Response, NextFunction } from 'express';

import { HttpStatus } from '@/lib/HttpStatus';
import { OrderService } from './order.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/drizzle.schema';

export class OrderController {
  private orderService: OrderService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.orderService = new OrderService(pool);
  }

  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    const id = (req.query.id as string) || undefined;
    const limit = Number(req.query.limit) || 10; // Default limit to 10
    const offset = Number(req.query.offset) || 0;

    try {
      const data = await this.orderService.getAllOrder(id, limit, offset);
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data retrieved successfully',
        total_data: data?.length,
        limit: limit,
        offset: offset,
        data: data,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { order_id } = req.params;
      const data = await this.orderService.getOrderById(Number(order_id));
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        status: 'Error',
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_id, items_ordered, expected_arrival, status } = req.body;

      await this.orderService.createOrder({
        product_id,
        items_ordered,
        expected_arrival,
        status,
      });
      res
        .status(HttpStatus.CREATED.code)
        .json({ status: 'Success', message: 'Successfully Created Supplier' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        status: 'Error',
        message: 'Internal Server Error ',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { order_id } = req.params;
      const { product_id, items_ordered, expected_arrival, status } = req.body;

      await this.orderService.updateOrder(
        { product_id, items_ordered, expected_arrival, status },
        Number(order_id),
      );
      res
        .status(HttpStatus.OK.code)
        .json({ status: 'Success', message: 'Supplier Updated Successfully' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { order_id } = req.params;
      await this.orderService.deleteOrder(Number(order_id));
      res.status(200).json({
        status: 'Success',
        message: `Supplier ID:${order_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }
}

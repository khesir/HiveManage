import { Request, Response, NextFunction } from 'express';

import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { HttpStatus } from '../../../../../lib/HttpStatus';
import { OrderService } from './order.service';

export class OrderController {
  private orderService: OrderService;

  constructor(pool: MySql2Database) {
    this.orderService = new OrderService(pool);
  }

  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) || 10; // Default limit to 10
    const sort = (req.query.sort as string) || 'asc'; // Default sort to 'asc'
    const page = Number(req.query.page) || 1;
    try {
      const Orders = await this.orderService.getAllOrder({
        limit,
        sort,
        page,
      });
      res.status(200).json({ data: Orders });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { order_id } = req.params;
      const data = await this.orderService.getOrderById(Number(order_id));
      res.status(200).json({ message: data });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
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
        .json({ message: 'Successfully Created Supplier' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
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
        .json({ message: 'Supplier Updated Successfully' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { order_id } = req.params;
      await this.orderService.deleteOrder(Number(order_id));
      res.status(200).json({
        message: `Supplier ID:${order_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }
}

import { Request, Response, NextFunction } from 'express';

import { HttpStatus } from '@/lib/HttpStatus';
import { OrderService } from './order.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';

export class OrderController {
  private orderService: OrderService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.orderService = new OrderService(pool);
  }

  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    const supplier_id = req.query.supplier_id
      ? String(req.query.order_id)
      : undefined; // This is search based on customer
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const sort = (req.query.sort as string) || 'asc';
    const includes =
      typeof req.query.includes === 'string'
        ? req.query.includes.split(',')
        : [];
    try {
      const data = await this.orderService.getAllOrder(
        supplier_id,
        sort,
        limit,
        offset,
        includes,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data retrieved successfully',
        total_data: data.totalData,
        limit: limit,
        offset: offset,
        data: data.orderWithDetails,
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
      res.status(200).json({ status: 'Success', data: data });
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
      const {
        supplier_id,
        notes,
        expected_arrival,
        order_value,
        order_products,
        order_status,
        order_payment_status,
        order_payment_method,
      } = req.body;

      await this.orderService.createOrder({
        supplier_id,
        notes,
        expected_arrival,
        order_value,
        order_products,
        order_status,
        order_payment_status,
        order_payment_method,
      });
      res
        .status(HttpStatus.CREATED.code)
        .json({ status: 'Success', message: 'Successfully Created Order' });
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
        message: `Order ID:${order_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }
}

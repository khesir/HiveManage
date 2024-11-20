import { Request, Response, NextFunction } from 'express';

import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { OrderItemTrackingService } from './orderitemtracking.service';
import { SchemaType } from '@/drizzle/drizzle.schema';
import { HttpStatus } from '@/lib/config';

export class OrderItemTracking {
  private orderItemTracking: OrderItemTrackingService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.orderItemTracking = new OrderItemTrackingService(pool);
  }

  async getAllOrderItemTracking(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { orderItem_id } = await req.params;
      const data =
        await this.orderItemTracking.getAllOrderItemTracking(orderItem_id);
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        data: data,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error' });
      next(error);
    }
  }

  async createOrderItemTracking(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { orderItem_id, order_id } = req.params;
      const product_id = (req.query.product_id as string) || undefined;
      const { track_record, product_name, quantity } = req.body;
      await this.orderItemTracking.createOrderItemTracking(
        { track_record: track_record, product_name, quantity },
        order_id,
        product_id,
        orderItem_id,
      );
      res
        .status(HttpStatus.CREATED.code)
        .json({ status: 'Sucess', message: 'Succussfully Created Supplier' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        status: 'Error',
        message: 'Internal Server Error ',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async updateOrderItemTracking(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { order_item_id } = req.params;
      const { tag, status, quantity, remarks } = req.body;
      await this.orderItemTracking.updateOrderItemTracking(
        { tag, status, quantity, remarks },
        order_item_id,
      );
      res
        .status(HttpStatus.CREATED.code)
        .json({ status: 'Sucess', message: 'Succussfully Created Supplier' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        status: 'Error',
        message: 'Internal Server Error ',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async deleteOrderItemTracking(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { order_item_id } = req.params;
      await this.orderItemTracking.deleteOrderItemTracking(order_item_id);
      res.status(200).json({
        status: 'Success',
        message: `Supplier ID:${order_item_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }
}

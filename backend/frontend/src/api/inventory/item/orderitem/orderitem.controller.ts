import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { OrderItemService } from './orderitem.service';
import { SchemaType } from '@/drizzle/drizzle.schema';

export class OrderItemsController {
  private orderitemService: OrderItemService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.orderitemService = new OrderItemService(pool);
  }

  async getAllOrderItem(req: Request, res: Response, next: NextFunction) {
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.orderitemService.getAllOrderItem(
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
        data: data.OrderitemsWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getOrderItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderItem_id } = req.params;
      const data = await this.orderitemService.getOrderItemById(orderItem_id);
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createOrderItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { order_id, product_id, quantity, price } = req.body;

      await this.orderitemService.createOrderItem({
        order_id,
        product_id,
        quantity,
        price,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Order Item ',
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

  async updateOrderItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderItem_id } = req.params;
      const { order_id, product_id, quantity, price } = req.body;

      await this.orderitemService.updateOrderItem(
        { order_id, product_id, quantity, price },
        orderItem_id,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Order Item Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteOrderItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderItem_id } = req.params;
      await this.orderitemService.deleteOrderItem(Number(orderItem_id));
      res.status(200).json({
        status: 'Success',
        message: `Order Item ID:${orderItem_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

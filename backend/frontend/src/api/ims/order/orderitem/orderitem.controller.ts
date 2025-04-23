import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { OrderItemService } from './orderitem.service';
import { SchemaType } from '@/drizzle/schema/type';

export class OrderItemsController {
  private orderitemService: OrderItemService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.orderitemService = new OrderItemService(pool);
  }

  async getAllOrderItem(req: Request, res: Response, next: NextFunction) {
    const order_id = (req.params.order_id as string) || undefined;
    const product_id = (req.query.product_id as string) || undefined;
    const no_pagination = req.query.no_pagination == 'true';
    const sort = (req.query.sort as string) || 'asc';
    const limit = Number(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    try {
      const data = await this.orderitemService.getAllOrderItem(
        order_id,
        product_id,
        sort,
        limit,
        offset,
        no_pagination,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.totalData,
        limit: limit,
        offset: offset,
        data: data.orderitemWithDetails,
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
      const data = await this.orderitemService.getOrderItemById(
        Number(orderItem_id),
      );
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
      const {
        order_id,
        product_id,
        total_quantity,
        ordered_quantity,
        unit_price,
        status,
        user,
      } = req.body;

      await this.orderitemService.createOrderItem({
        order_id,
        product_id,
        total_quantity,
        ordered_quantity,
        unit_price,
        status,
        user,
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
      const {
        order_id,
        product_id,
        total_quantity,
        ordered_quantity,
        delivered_quantity,
        unit_price,
        status,
        user,
      } = req.body;
      await this.orderitemService.updateOrderItem(
        {
          order_id,
          product_id,
          total_quantity,
          ordered_quantity,
          delivered_quantity,
          unit_price,
          status,
          user,
        },
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
      const { orderItem_id, order_id } = req.params;
      const user = req.query.user as string | undefined;
      await this.orderitemService.deleteOrderItem(
        Number(orderItem_id),
        Number(order_id),
        Number(user),
      );
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

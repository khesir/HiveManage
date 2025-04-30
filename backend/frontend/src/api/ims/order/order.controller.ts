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
  async getOrdersByProductID(req: Request, res: Response, next: NextFunction) {
    const product_id = (req.query.product_id as string) || undefined;
    const supplier_id = (req.query.supplier_id as string) || undefined;
    const status =
      typeof req.query.status === 'string' ? req.query.status.split(',') : [];
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const no_pagination = req.query.no_pagination == 'true';

    try {
      const data = await this.orderService.getOrdersByProductID(
        limit,
        offset,
        no_pagination,
        status,
        Number(product_id),
        Number(supplier_id),
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
  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    const supplier_id = (req.query.supplier_id as string) || undefined;
    const status = (req.query.status as string) || undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const sort = (req.query.sort as string) || 'asc';
    const includes =
      typeof req.query.includes === 'string'
        ? req.query.includes.split(',')
        : [];
    try {
      const data = await this.orderService.getAllOrder(
        sort,
        limit,
        offset,
        includes,
        Number(supplier_id),
        status,
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
      const includes =
        typeof req.query.includes === 'string'
          ? req.query.includes.split(',')
          : [];
      const data = await this.orderService.getOrderById(
        Number(order_id),
        includes,
      );
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
        notes,
        supplier_id,
        expected_arrival,
        order_value,
        order_products,
        order_status,
        order_payment_status,
        order_payment_method,
        user,
      } = req.body;

      await this.orderService.createOrder({
        notes,
        supplier_id,
        expected_arrival,
        order_value,
        order_products,
        order_status,
        order_payment_status,
        order_payment_method,
        user,
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
      const {
        notes,
        supplier_id,
        expected_arrival,
        order_value,
        order_status,
        order_payment_status,
        order_payment_method,
        user,
      } = req.body;

      await this.orderService.updateOrder(
        {
          notes,
          supplier_id,
          expected_arrival,
          order_value,
          order_status,
          order_payment_status,
          order_payment_method,
          user,
        },
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
      const user = req.query.user_id as string | undefined;
      await this.orderService.deleteOrder(Number(order_id), Number(user));
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

  async finalize(req: Request, res: Response, next: NextFunction) {
    const { order_id } = req.params;
    const {
      notes,
      supplier_id,
      expected_arrival,
      order_value,
      order_products,
      order_status,
      order_payment_status,
      order_payment_method,
      user,
    } = req.body;
    try {
      await this.orderService.finalize(
        {
          notes,
          supplier_id,
          expected_arrival,
          order_value,
          order_products,
          order_status,
          order_payment_status,
          order_payment_method,
          user,
        },
        Number(order_id),
      );
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
  async pushToInventory(req: Request, res: Response, next: NextFunction) {
    const { order_id } = req.params;
    const {
      notes,
      supplier_id,
      expected_arrival,
      order_value,
      order_products,
      order_status,
      order_payment_status,
      order_payment_method,
      user,
    } = req.body;
    try {
      await this.orderService.pushToInventory(
        {
          notes,
          supplier_id,
          expected_arrival,
          order_value,
          order_products,
          order_status,
          order_payment_status,
          order_payment_method,
          user,
        },
        Number(order_id),
      );
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
  async uploadDeliveryReceipt(req: Request, res: Response, next: NextFunction) {
    const { order_id } = req.params;
    try {
      await this.orderService.uploadOrder(Number(order_id), req.file!);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '@/lib/HttpStatus';
import { SalesItemService } from './salesItem.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';

export class SalesItemController {
  private salesitemService: SalesItemService;

  constructor(pool: PostgresJsDatabase) {
    this.salesitemService = new SalesItemService(pool);
  }

  async getAllSalesItem(req: Request, res: Response, next: NextFunction) {
    const id = (req.query.id as string) || undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.salesitemService.getAllSalesItem(
        id,
        limit,
        offset,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.length,
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

  async getSalesItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const { sales_item_id } = req.params;
      const data = await this.salesitemService.getSalesItemById(
        Number(sales_item_id),
      );
      res.status(200).json({ message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createSalesItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { sales_id, item_id, quantity, is_service_item, total_price } =
        req.body;

      await this.salesitemService.createSalesItem({
        sales_id,
        item_id,
        quantity,
        is_service_item,
        total_price,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Sales Item ',
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

  async updateSalesItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { sales_item_id } = req.params;
      const { sales_id, item_id, quantity, is_service_item, total_price } =
        req.body;

      await this.salesitemService.updateSalesItem(
        { sales_id, item_id, quantity, is_service_item, total_price },
        Number(sales_item_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Sales Item Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteSalesItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { sales_item_id } = req.params;
      await this.salesitemService.deleteSalesItem(Number(sales_item_id));
      res.status(200).json({
        status: 'Success',
        message: `Sales Item ID:${sales_item_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

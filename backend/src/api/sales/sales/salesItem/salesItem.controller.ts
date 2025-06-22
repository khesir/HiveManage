import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '@/lib/HttpStatus';
import { SalesItemService } from './salesItem.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { SchemaType } from '@/drizzle/schema/type';

export class SalesItemController {
  private salesitemService: SalesItemService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.salesitemService = new SalesItemService(pool);
  }

  async getAllSalesItem(req: Request, res: Response, next: NextFunction) {
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const product_id = (req.query.product_id as string) || undefined;
    const sale_id = (req.query.product_id as string) || undefined;
    try {
      const data = await this.salesitemService.getAllSalesItem(
        product_id,
        sale_id,
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
        data: data.salesitemWithDetails,
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
      const {
        product_id,
        sales_id,
        quantity,
        product_record_id,
        serial_id,
        total_price,
        sold_price,
      } = req.body;

      await this.salesitemService.createSalesItem({
        product_id,
        sales_id,
        product_record_id,
        serial_id,
        quantity,
        total_price,
        sold_price,
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
      const { sales_items_id } = req.params;
      const {
        product_id,
        sale_id,
        quantity,
        product_record_id,
        serial_id,
        total_price,
        sold_price,
        return_qty,
        damage_qty,
        restocked_qty,
        return_note,
      } = req.body;

      await this.salesitemService.updateSalesItem(
        {
          product_id,
          sale_id,
          product_record_id,
          serial_id,
          quantity,
          total_price,
          sold_price,
          return_qty,
          damage_qty,
          restocked_qty,
          return_note,
        },
        Number(sales_items_id),
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
      const { sales_items_id } = req.params;
      await this.salesitemService.deleteSalesItem(Number(sales_items_id));
      res.status(200).json({
        status: 'Success',
        message: `Sales Item ID:${sales_items_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }

  async returnSalesItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { sales_item_id } = req.params;
      const {
        product_id,
        sales_id,
        quantity,
        sold_price,
        return_qty,
        refund_amount,
        return_note,
        warranty_date,
        warranty_used,
        user_id,
      } = req.body;
      console.log(sales_item_id);
      await this.salesitemService.addReturn(
        {
          product_id,
          sales_id,
          quantity,
          sold_price,
          return_qty,
          refund_amount,
          return_note,
          warranty_date,
          warranty_used,
          user_id,
        },
        Number(sales_item_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Sales Item Updated Successfully ',
      });
    } catch (error) {
      console.log(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }
}

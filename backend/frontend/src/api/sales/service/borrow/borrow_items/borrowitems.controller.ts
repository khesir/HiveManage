import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { BorrowItemService } from './borrowitems.service';

export class BorrowItemController {
  private borrowitemService: BorrowItemService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.borrowitemService = new BorrowItemService(pool);
  }

  async getAllBorrowItem(req: Request, res: Response, next: NextFunction) {
    const status = (req.query.status as string) || undefined;
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.borrowitemService.getAllBorrowItem(
        status,
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
        data: data.borrowitemWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getBorrowItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const { borrow_item_id } = req.params;
      const data = await this.borrowitemService.getBorrowItemById(
        Number(borrow_item_id),
      );
      res.status(200).json({ message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createBorrowItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_id, borrow_id, borrow_date, fee, status, return_date } =
        req.body;

      await this.borrowitemService.createBorrowItem({
        product_id,
        borrow_id,
        fee,
        status,
        return_date,
        borrow_date,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Borrow Item ',
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

  async updateBorrowItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { borrow_item_id } = req.params;
      const { product_id, borrow_id, fee, status, return_date, borrow_date } =
        req.body;

      await this.borrowitemService.updateBorrowItem(
        { product_id, borrow_id, fee, status, return_date, borrow_date },
        Number(borrow_item_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Borrow Item Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteBorrowItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { borrow_item_id } = req.params;
      await this.borrowitemService.deleteBorrowItem(Number(borrow_item_id));
      res.status(200).json({
        status: 'Success',
        message: `Borrow Item ID:${borrow_item_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

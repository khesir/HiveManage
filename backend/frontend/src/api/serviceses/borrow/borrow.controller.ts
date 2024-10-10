import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { BorrowService } from './borrow.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class BorrowController {
  private borrowService: BorrowService;

  constructor(pool: PostgresJsDatabase) {
    this.borrowService = new BorrowService(pool);
  }

  async getAllBorrow(req: Request, res: Response, next: NextFunction) {
    const id = (req.query.id as string) || undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.borrowService.getAllBorrow(id, limit, offset);
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

  async getBorrowById(req: Request, res: Response, next: NextFunction) {
    try {
      const { borrow_id } = req.params;
      const data = await this.borrowService.getBorrowById(Number(borrow_id));
      res.status(200).json({ message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createBorrow(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        sales_id,
        service_id,
        item_id,
        borrow_date,
        return_data,
        status,
      } = req.body;

      await this.borrowService.createBorrow({
        sales_id,
        service_id,
        item_id,
        borrow_date,
        return_data,
        status,
      });
      res
        .status(HttpStatus.CREATED.code)
        .json({ status: 'Success', message: 'Successfully Created Borrow ' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        status: 'Error ',
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async updateBorrow(req: Request, res: Response, next: NextFunction) {
    try {
      const { borrow_id } = req.params;
      const {
        sales_id,
        service_id,
        item_id,
        borrow_date,
        return_data,
        status,
      } = req.body;

      await this.borrowService.updateBorrow(
        { sales_id, service_id, item_id, borrow_date, return_data, status },
        Number(borrow_id),
      );
      res
        .status(HttpStatus.OK.code)
        .json({ status: 'Success', message: 'Borrow Updated Successfully ' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteBorrow(req: Request, res: Response, next: NextFunction) {
    try {
      const { borrow_id } = req.params;
      await this.borrowService.deleteBorrow(Number(borrow_id));
      res.status(200).json({
        status: 'Success',
        message: `Borrow ID:${borrow_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

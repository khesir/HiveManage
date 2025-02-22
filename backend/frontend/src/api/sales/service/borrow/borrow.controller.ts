import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { BorrowService } from './borrow.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';

export class BorrowController {
  private borrowService: BorrowService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.borrowService = new BorrowService(pool);
  }

  async getAllBorrow(req: Request, res: Response, next: NextFunction) {
    const customer_id = (req.params.customer_id as string) || undefined;
    const status = (req.query.status as string) || undefined;
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.borrowService.getAllBorrow(
        customer_id,
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
        data: data.borrowWithDetails,
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
      const { customer_id, borrow_date, return_date, fee, status } = req.body;

      await this.borrowService.createBorrow({
        customer_id,
        borrow_date,
        return_date,
        fee,
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
      const { customer_id, borrow_date, return_data, fee, status } = req.body;

      await this.borrowService.updateBorrow(
        {
          customer_id,
          borrow_date,
          return_data,
          fee,
          status,
        },
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

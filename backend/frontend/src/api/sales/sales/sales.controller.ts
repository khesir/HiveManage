import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { SalesService } from './sales.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class SalesController {
  private salesService: SalesService;

  constructor(pool: PostgresJsDatabase) {
    this.salesService = new SalesService(pool);
  }

  async getAllSales(req: Request, res: Response, next: NextFunction) {
    const id = (req.query.id as string) || undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.salesService.getAllSales(id, limit, offset);
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

  async getSalesById(req: Request, res: Response, next: NextFunction) {
    try {
      const { sales_id } = req.params;
      const data = await this.salesService.getSalesById(Number(sales_id));
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createSales(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id, customer_id, total_amount } = req.body;

      await this.salesService.createSales({
        employee_id,
        customer_id,
        total_amount,
      });
      res
        .status(HttpStatus.CREATED.code)
        .json({ status: 'Success', message: 'Successfully Created Sales ' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        status: 'Error ',
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async updateSales(req: Request, res: Response, next: NextFunction) {
    try {
      const { sales_id } = req.params;
      const { employee_id, customer_id, total_amount } = req.body;

      await this.salesService.updateSales(
        { employee_id, customer_id, total_amount },
        Number(sales_id),
      );
      res
        .status(HttpStatus.OK.code)
        .json({ status: 'Success', message: 'Sales Updated Successfully ' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteSales(req: Request, res: Response, next: NextFunction) {
    try {
      const { sales_id } = req.params;
      await this.salesService.deleteSales(Number(sales_id));
      res.status(200).json({
        status: 'Success',
        message: `Sales ID:${sales_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}

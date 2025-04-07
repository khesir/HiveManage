import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { SalesService } from './sales.service';

export class SalesController {
  private salesService: SalesService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.salesService = new SalesService(pool);
  }

  async getAllSales(req: Request, res: Response, next: NextFunction) {
    const customer_id = (req.params.customer_id as string) || undefined;
    const employee_id = (req.query.handled_by as string) || undefined;
    const status = (req.query.status as string) || undefined;
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.salesService.getAllSales(
        customer_id,
        employee_id,
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
        data: data.salesWithDetails,
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
      res.status(200).json({ message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createSales(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, salesItem, customer, handled_by, payment } = req.body;

      const data = await this.salesService.createSales({
        status,
        salesItem,
        customer,
        handled_by,
        payment,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Sales ',
        data: data,
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

  async updateSales(req: Request, res: Response, next: NextFunction) {
    try {
      const { sales_id } = req.params;
      const { status, salesItem, customer, handled_by, payment } = req.body;

      await this.salesService.updateSales(
        { status, salesItem, customer, handled_by, payment },
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

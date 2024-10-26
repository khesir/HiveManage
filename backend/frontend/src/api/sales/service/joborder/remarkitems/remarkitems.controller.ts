import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/drizzle.schema';
import { RemarkItemsService } from './remarkitems.service';

export class RemarkItemsController {
  private remarkitemService: RemarkItemsService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.remarkitemService = new RemarkItemsService(pool);
  }

  async getAllRemarkItems(req: Request, res: Response, next: NextFunction) {
    const remark_id = (req.params.remark_id as string) || undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.remarkitemService.getAllRemarkItems(
        remark_id,
        limit,
        offset,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.totalData,
        limit: limit,
        offset: offset,
        data: data.remarkitemsWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getRemarkItemsById(req: Request, res: Response, next: NextFunction) {
    try {
      const { remark_items_id } = req.params;
      const data = await this.remarkitemService.getRemarkItemsById(
        Number(remark_items_id),
      );
      res.status(200).json({ status: 'Success', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createRemarkItems(req: Request, res: Response, next: NextFunction) {
    try {
      const remark_id = Number(req.params.remark_id);
      const { sales_items_id } = req.body;

      await this.remarkitemService.createRemarkItems({
        sales_items_id,
        remark_id,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Remark Items ',
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

  async updateRemarkItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { remark_items_id } = req.params;
      const remark_id = Number(req.params.service_id);
      const { sales_items_id } = req.body;

      await this.remarkitemService.updateRemarkItems(
        { sales_items_id, remark_id },
        Number(remark_items_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Remark Items Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteRemarkItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { remark_items_id } = req.params;
      await this.remarkitemService.deleteRemarkItems(Number(remark_items_id));
      res.status(200).json({
        status: 'Success',
        message: `Remark Items ID:${remark_items_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
